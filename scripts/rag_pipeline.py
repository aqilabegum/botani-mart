import os
import time
import chromadb

from dotenv import load_dotenv
from google import genai
from google.genai import errors
from sentence_transformers import SentenceTransformer
from pathlib import Path

from scripts.context_assembly import build_context
from scripts.prompt_template import build_prompt


# 1. Membaca konfigurasi API
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL")

if not api_key or not model_name:
    raise ValueError("Konfigurasi Gemini API tidak lengkap!")

client_gemini = genai.Client(api_key=api_key)


# 2. Memuat embedding model
print("Memuat embedding model...")

embedding_model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


# 3. Menghubungkan ke ChromaDB
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "vector_db"

client_chroma = chromadb.PersistentClient(
    path=str(DB_PATH)
)

collection = client_chroma.get_collection(
    name="botani_mart_knowledge"
)


# 4. Mengambil daftar nama produk
all_data = collection.get(include=["metadatas"])

product_names = set()

for metadata in all_data["metadatas"]:
    name = metadata.get("product_name")

    if name:
        product_names.add(name)


# 5. Fungsi utama RAG
def generate_answer(question: str, history=None):

    question = question.strip()

    if not question:
        raise ValueError("Pertanyaan tidak boleh kosong!")

    # Memahami konteks percakapan tanpa pemanggilan Gemini
    history = history or []

    follow_up_keywords = [
        "nya",
        "itu",
        "tersebut",
        "tadi",
        "perawatannya",
        "produk tersebut",
        "produk itu"
    ]

    question_lower_original = question.lower()

    is_follow_up = any(
        keyword in question_lower_original
        for keyword in follow_up_keywords
    )

    recent_user_messages = [
        item["content"]
        for item in history[-6:]
        if item.get("role") == "user"
    ]

    if is_follow_up and recent_user_messages:
        retrieval_question = (
            "Konteks pertanyaan sebelumnya: "
            + " ".join(recent_user_messages[-2:])
            + "\nPertanyaan terbaru: "
            + question
        )
    else:
        retrieval_question = question

    question_lower = retrieval_question.lower()

    # 5a. Mengidentifikasi jenis informasi
    chunk_type = None

    if any(word in question_lower for word in [
        "manfaat", "kegunaan", "fungsi"
    ]):
        chunk_type = "benefits"

    elif any(word in question_lower for word in [
        "cara menggunakan", "cara penggunaan",
        "petunjuk penggunaan", "dosis", "mengaplikasikan"
    ]):
        chunk_type = "usage"

    elif any(word in question_lower for word in [
        "deskripsi", "apa itu", "pengertian"
    ]):
        chunk_type = "description"


    # 5b. Mengidentifikasi nama produk
    matched_product = None

    for name in sorted(product_names, key=len, reverse=True):
        if name.lower() in question_lower:
            matched_product = name
            break


    
    # 5c. Membuat embedding pertanyaan
    query_embedding = embedding_model.encode(
        retrieval_question,
        normalize_embeddings=True
    ).tolist()


    # 5d. Menentukan filter retrieval
    where_filter = None

    if matched_product and chunk_type:
        where_filter = {
            "$and": [
                {"product_name": matched_product},
                {"chunk_type": chunk_type}
            ]
        }

    elif matched_product:
        where_filter = {
            "product_name": matched_product
        }

    elif chunk_type:
        where_filter = {
            "chunk_type": chunk_type
        }


    # 5e. Melakukan retrieval
    query_arguments = {
        "query_embeddings": [query_embedding],
        "n_results": 5,
        "include": [
            "documents",
            "metadatas",
            "distances"
        ]
    }

    if where_filter:
        query_arguments["where"] = where_filter

    results = collection.query(**query_arguments)


    # 5f. Fallback jika tidak ditemukan
    if not results["ids"][0] and where_filter:
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=5,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )


    # 5g. Menyiapkan hasil retrieval
    retrieved_chunks = []

    for i in range(len(results["ids"][0])):
        retrieved_chunks.append({
            "chunk_id": results["ids"][0][i],
            "content": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "distance": results["distances"][0][i]
        })


    # 5h. Membuat context
    context = build_context(retrieved_chunks)


    # 5i. Membuat prompt
    prompt = build_prompt(
        question=question,
        context=context,
        history=history
    )


    # 5j. Mengirim prompt ke Gemini
    response = None

    for attempt in range(3):
        try:
            response = client_gemini.models.generate_content(
                model=model_name,
                contents=prompt
            )

            break

        except errors.ServerError as e:
            if e.code == 503:
                if attempt < 2:
                    wait_time = 2 ** (attempt + 1)
                    time.sleep(wait_time)
                else:
                    raise
            else:
                raise

    if response is None or not response.text:
        raise RuntimeError("Gemini tidak menghasilkan jawaban!")


    # 5k. Mengembalikan hasil
    return {
        "answer": response.text,
        "retrieved_chunks": [
            {
                "chunk_id": chunk["chunk_id"],
                "product_name": chunk["metadata"].get("product_name"),
                "chunk_type": chunk["metadata"].get("chunk_type"),
                "distance": chunk["distance"]
            }
            for chunk in retrieved_chunks
        ]
    }
