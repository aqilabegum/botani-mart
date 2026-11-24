
import chromadb
from pathlib import Path
from sentence_transformers import SentenceTransformer

# Menentukan lokasi project
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "vector_db"

# Memuat model embedding
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

print("Memuat model embedding...")
model = SentenceTransformer(MODEL_NAME)
print("Model berhasil dimuat!")

# Membuka Vector Database
client = chromadb.PersistentClient(path=str(DB_PATH))

collection = client.get_collection(
    name="botani_mart_knowledge"
)

print(f"\nJumlah data dalam ChromaDB: {collection.count()}")

# Mengambil seluruh metadata produk
all_data = collection.get(
    include=["metadatas"]
)

# Membuat daftar nama produk unik
product_names = sorted(
    set(
        metadata["product_name"]
        for metadata in all_data["metadatas"]
    )
)

# Meminta pertanyaan pengguna
question = input("\nMasukkan pertanyaan: ")

# Mengidentifikasi produk berdasarkan nama
question_lower = question.lower()

selected_product = None

for product in product_names:
    if product.lower() in question_lower:
        selected_product = product
        break

# Mengidentifikasi jenis informasi
if any(word in question_lower for word in ["manfaat", "kegunaan", "fungsi"]):
    selected_chunk_type = "benefits"

elif any(word in question_lower for word in ["cara menggunakan", "cara penggunaan", "petunjuk penggunaan", "dosis", "mengaplikasikan"]):
    selected_chunk_type = "usage"

elif any(word in question_lower for word in ["deskripsi", "apa itu", "pengertian"]):
    selected_chunk_type = "description"

else:
    selected_chunk_type = None

# Membuat embedding pertanyaan
query_embedding = model.encode(
    [question],
    normalize_embeddings=True
).tolist()

# Menyiapkan filter metadata
where_filter = None

if selected_product and selected_chunk_type:
    where_filter = {
        "$and": [
            {"product_name": selected_product},
            {"chunk_type": selected_chunk_type}
        ]
    }

elif selected_product:
    where_filter = {
        "product_name": selected_product
    }

elif selected_chunk_type:
    where_filter = {
        "chunk_type": selected_chunk_type
    }

# Melakukan pencarian
if where_filter:
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=5,
        where=where_filter,
        include=["documents", "metadatas", "distances"]
    )
else:
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=5,
        include=["documents", "metadatas", "distances"]
    )

# Menampilkan hasil retrieval
print("\n=== HASIL RETRIEVAL ===")
print(f"Produk teridentifikasi: {selected_product}")
print(f"Jenis informasi: {selected_chunk_type}")

for i in range(len(results["documents"][0])):
    print(f"\nHasil ke-{i+1}")
    print(f"Jarak: {results['distances'][0][i]}")
    print(f"ID Chunk: {results['ids'][0][i]}")
    print(f"Metadata: {results['metadatas'][0][i]}")
    print(f"Dokumen: {results['documents'][0][i]}")
    print("-" * 60)
