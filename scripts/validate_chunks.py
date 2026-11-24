
import json
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_PATH = BASE_DIR / "knowledge_base" / "product_chunks.json"

# Membaca chunk
with open(INPUT_PATH, "r", encoding="utf-8") as file:
    chunks = json.load(file)

# Mengambil seluruh ID chunk
chunk_ids = [chunk["chunk_id"] for chunk in chunks]

# Menghitung ID duplikat
duplicate_ids = [
    chunk_id
    for chunk_id, count in Counter(chunk_ids).items()
    if count > 1
]

# Memeriksa isi kosong
empty_content = [
    chunk["chunk_id"]
    for chunk in chunks
    if not chunk.get("content", "").strip()
]

# Memeriksa metadata
required_metadata = [
    "product_id",
    "product_name",
    "category",
    "evidence_status",
    "source_title",
    "source_url",
    "document_type",
    "chunk_type"
]

invalid_metadata = []

for chunk in chunks:
    metadata = chunk.get("metadata", {})

    for field in required_metadata:
        if field not in metadata or metadata[field] is None:
            invalid_metadata.append(
                f"{chunk['chunk_id']} - {field}"
            )

# Menghitung chunk per produk
product_counts = Counter(
    chunk["product_id"] for chunk in chunks
)

# Menghitung jenis chunk
chunk_types = Counter(
    chunk["metadata"]["chunk_type"]
    for chunk in chunks
)

# Menampilkan hasil
print("=== VALIDASI KNOWLEDGE BASE ===")
print(f"Total chunk: {len(chunks)}")
print(f"Total produk: {len(product_counts)}")
print(f"ID chunk duplikat: {len(duplicate_ids)}")
print(f"Isi chunk kosong: {len(empty_content)}")
print(f"Metadata bermasalah: {len(invalid_metadata)}")

print("\nJumlah chunk per jenis:")
for name, count in sorted(chunk_types.items()):
    print(f"{name}: {count}")

# Memeriksa apakah semua produk memiliki 5 chunk
products_not_five = {
    product_id: count
    for product_id, count in product_counts.items()
    if count != 5
}

print("\nProduk dengan jumlah chunk bukan 5:")
print(products_not_five)

# Kesimpulan
if (
    len(product_counts) == 103
    and len(duplicate_ids) == 0
    and len(empty_content) == 0
    and len(invalid_metadata) == 0
    and len(products_not_five) == 0
):
    print("\nVALIDASI BERHASIL!")
else:
    print("\nVALIDASI PERLU DIPERIKSA KEMBALI!")
