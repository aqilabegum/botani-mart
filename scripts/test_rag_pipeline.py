
import chromadb
from sentence_transformers import SentenceTransformer

from context_assembly import build_context


# 1. Memuat embedding model
print("Memuat embedding model...")

model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


# 2. Menghubungkan ke ChromaDB
client = chromadb.PersistentClient(
    path="vector_db"
)

collection = client.get_collection(
    name="botani_mart_knowledge"
)


# 3. Menerima pertanyaan
question = input("\nMasukkan pertanyaan: ").strip()
question_lower = question.lower()


# 4. Mengidentifikasi jenis informasi
chunk_type = None

if any(word in question_lower for word in [
    "manfaat", "kegunaan", "fungsi"
]):
    chunk_type = "benefits"

elif any(word in question_lower for word in [
    "cara menggunakan",
    "cara penggunaan",
    "petunjuk penggunaan",
    "dosis",
    "mengaplikasikan"
]):
    chunk_type = "usage"

elif any(word in question_lower for word in [
    "deskripsi", "apa itu", "pengertian"
]):
    chunk_type = "description"


# 5. Mengidentifikasi nama produk dari metadata
all_data = collection.get(
    include=["metadatas"]
)

product_names = set()

for metadata in all_data["metadatas"]:
    name = metadata.get("product_name")

    if name:
        product_names.add(name)

matched_product = None

# Nama terpanjang diperiksa lebih dahulu
for name in sorted(product_names, key=len, reverse=True):
    if name.lower() in question_lower:
        matched_product = name
        break


print("\n=== IDENTIFIKASI PERTANYAAN ===")
print("Produk:", matched_product or "Tidak teridentifikasi")
print("Jenis informasi:", chunk_type or "Tidak teridentifikasi")


# 6. Membuat embedding pertanyaan
query_embedding = model.encode(
    question,
    normalize_embeddings=True
).tolist()


# 7. Menentukan strategi retrieval
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


# 8. Melakukan retrieval
query_arguments = {
    "query_embeddings": [query_embedding],
    "n_results": 5,
    "include": ["documents", "metadatas", "distances"]
}

if where_filter:
    query_arguments["where"] = where_filter

results = collection.query(**query_arguments)


# 9. Fallback jika filter tidak menemukan hasil
if not results["ids"][0] and where_filter:
    print("\nFilter tidak menemukan hasil. Menggunakan semantic retrieval.")

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5,
        include=["documents", "metadatas", "distances"]
    )


# 10. Mengubah hasil retrieval ke format Context Assembly
retrieved_chunks = []

for i in range(len(results["ids"][0])):
    retrieved_chunks.append({
        "chunk_id": results["ids"][0][i],
        "content": results["documents"][0][i],
        "metadata": results["metadatas"][0][i],
        "distance": results["distances"][0][i]
    })


# 11. Menyusun context
context = build_context(retrieved_chunks)


# 12. Menampilkan hasil
print("\n=== HASIL RETRIEVAL ===")

for chunk in retrieved_chunks:
    print("\nChunk ID:", chunk["chunk_id"])
    print("Distance:", chunk["distance"])
    print("Produk:", chunk["metadata"].get("product_name"))
    print("Jenis:", chunk["metadata"].get("chunk_type"))


print("\n=== HASIL CONTEXT ASSEMBLY ===")
print(context)
