import json
import chromadb
from pathlib import Path
from sentence_transformers import SentenceTransformer

# Lokasi project
BASE_DIR = Path(__file__).resolve().parent.parent

# Lokasi file chunk
INPUT_PATH = BASE_DIR / "knowledge_base" / "product_chunks.json"

# Lokasi database
DB_PATH = BASE_DIR / "vector_db"

# Membaca data chunk
with open(INPUT_PATH, "r", encoding="utf-8") as file:
    chunks = json.load(file)

print(f"Jumlah chunk yang dibaca: {len(chunks)}")

# Memuat model embedding
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

print("\nMemuat model embedding...")

model = SentenceTransformer(MODEL_NAME)

print("Model embedding berhasil dimuat!")

# Membuat koneksi ChromaDB
client = chromadb.PersistentClient(
    path=str(DB_PATH)
)

# Membuat atau mengambil collection
collection = client.get_or_create_collection(
    name="botani_mart_knowledge",
    metadata={"hnsw:space": "cosine"}
)

# Mengambil isi teks
texts = [chunk["content"] for chunk in chunks]

# Mengambil ID chunk
ids = [chunk["chunk_id"] for chunk in chunks]

# Mengambil metadata
metadatas = [
    {
        key: str(value)
        for key, value in chunk["metadata"].items()
    }
    for chunk in chunks
]

# Menghasilkan embedding
print("\nMenghasilkan embedding...")

embeddings = model.encode(
    texts,
    show_progress_bar=True,
    normalize_embeddings=True
)

# Menyimpan data ke ChromaDB
print("\nMenyimpan data ke ChromaDB...")

collection.upsert(
    ids=ids,
    documents=texts,
    embeddings=embeddings.tolist(),
    metadatas=metadatas
)

# Memeriksa hasil penyimpanan
total = collection.count()

print("\n=== HASIL VECTOR DATABASE ===")
print(f"Jumlah chunk input: {len(chunks)}")
print(f"Jumlah embedding: {len(embeddings)}")
print(f"Dimensi embedding: {embeddings.shape[1]}")
print(f"Jumlah data di ChromaDB: {total}")

if total == len(chunks):
    print("\nVECTOR DATABASE BERHASIL DIBUAT!")
else:
    print("\nJUMLAH DATA BELUM SESUAI!")
