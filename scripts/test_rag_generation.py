from google.genai import errors
import time
import os
import chromadb

from dotenv import load_dotenv
from google import genai
from sentence_transformers import SentenceTransformer

from context_assembly import build_context
from prompt_template import build_prompt


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
client_chroma = chromadb.PersistentClient(
    path="vector_db"
)

collection = client_chroma.get_collection(
    name="botani_mart_knowledge"
)


# 4. Menerima pertanyaan
question = input("\nMasukkan pertanyaan: ").strip()
question_lower = question.lower()


# 5. Mengidentifikasi jenis informasi
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


# 6. Mengidentifikasi nama produk
all_data = collection.get(include=["metadatas"])

product_names = set()

for metadata in all_data["metadatas"]:
    name = metadata.get("product_name")

    if name:
        product_names.add(name)

matched_product = None

for name in sorted(product_names, key=len, reverse=True):
    if name.lower() in question_lower:
        matched_product = name
        break


# 7. Membuat embedding pertanyaan
query_embedding = embedding_model.encode(
    question,
    normalize_embeddings=True
).tolist()


# 8. Menentukan filter retrieval
where_filter = None

if matched_product and chunk_type:
    where_filter = {
        "$and": [
            {"product_name": matched_product},
            {"chunk_type": chunk_type}
        ]
    }

elif matched_product:
    where_filter = {"product_name": matched_product}

elif chunk_type:
    where_filter = {"chunk_type": chunk_type}


# 9. Melakukan retrieval
query_arguments = {
    "query_embeddings": [query_embedding],
    "n_results": 5,
    "include": ["documents", "metadatas", "distances"]
}

if where_filter:
    query_arguments["where"] = where_filter

results = collection.query(**query_arguments)


# 10. Fallback jika tidak ditemukan
if not results["ids"][0] and where_filter:
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5,
        include=["documents", "metadatas", "distances"]
    )


# 11. Menyiapkan hasil retrieval
retrieved_chunks = []

for i in range(len(results["ids"][0])):
    retrieved_chunks.append({
        "chunk_id": results["ids"][0][i],
        "content": results["documents"][0][i],
        "metadata": results["metadatas"][0][i],
        "distance": results["distances"][0][i]
    })


# 12. Membuat context
context = build_context(retrieved_chunks)


# 13. Membuat prompt
prompt = build_prompt(
    question=question,
    context=context
)


# 14. Mengirim prompt ke Gemini
print("\nMengirim pertanyaan ke Gemini API...")


response = None

for attempt in range(3):
    try:
        print(f"Mencoba menghubungi Gemini ({attempt + 1}/3)...")

        response = client_gemini.models.generate_content(
            model=model_name,
            contents=prompt
        )

        break

    except errors.ServerError as e:
        if e.code == 503:
            print("Gemini sedang mengalami beban tinggi.")

            if attempt < 2:
                wait_time = 2 ** (attempt + 1)
                print(f"Mencoba kembali dalam {wait_time} detik...")
                time.sleep(wait_time)
            else:
                print("Gemini belum tersedia setelah 3 percobaan.")
                raise
        else:
            raise

if response is None or not response.text:
    raise RuntimeError("Gemini tidak menghasilkan jawaban.")



# 15. Menampilkan hasil
print("\n=== HASIL RETRIEVAL ===")

for chunk in retrieved_chunks:
    print(
        chunk["chunk_id"],
        "|",
        chunk["metadata"].get("product_name"),
        "|",
        chunk["metadata"].get("chunk_type")
    )


print("\n=== JAWABAN BOTANI MART AI ===")
print(response.text)
