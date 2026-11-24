
import json
from pathlib import Path

# Lokasi project
BASE_DIR = Path(__file__).resolve().parent.parent

# File input dan output
INPUT_PATH = BASE_DIR / "knowledge_base" / "products.json"
OUTPUT_DIR = BASE_DIR / "knowledge_base"

# Membaca data produk
with open(INPUT_PATH, "r", encoding="utf-8") as file:
    products = json.load(file)


def clean(value):
    if value is None:
        return ""
    return str(value).strip()


chunks = []

for product in products:

    product_id = clean(product.get("product_id"))
    product_name = clean(product.get("product_name"))
    category = clean(product.get("category"))

    variety = clean(product.get("variety_or_details"))
    price = clean(product.get("catalog_price"))

    evidence_status = clean(product.get("evidence_status"))
    evidence_scope = clean(product.get("evidence_scope"))

    source_title = clean(product.get("official_source_title"))
    source_url = clean(product.get("official_source_url"))

    # Metadata dasar yang digunakan bersama
    base_metadata = {
        "product_id": product_id,
        "product_name": product_name,
        "category": category,
        "evidence_status": evidence_status,
        "source_title": source_title,
        "source_url": source_url,
        "document_type": "product_knowledge"
    }

    # Bagian 1: Informasi produk
    product_info = f"""
Nama Produk: {product_name}
Kategori: {category}
ID Produk: {product_id}
Varietas atau Detail: {variety if variety else "Belum tersedia"}
Harga Katalog: {price if price else "Belum tersedia"}
""".strip()

    chunks.append({
        "chunk_id": f"{product_id}_product_info",
        "product_id": product_id,
        "content": product_info,
        "metadata": {
            **base_metadata,
            "chunk_type": "product_info"
        }
    })

    # Bagian 2: Deskripsi
    description = clean(product.get("verified_description"))

    if description:
        chunks.append({
            "chunk_id": f"{product_id}_description",
            "product_id": product_id,
            "content": (
                f"Produk: {product_name}\n"
                f"Deskripsi: {description}"
            ),
            "metadata": {
                **base_metadata,
                "chunk_type": "description"
            }
        })

    # Bagian 3: Manfaat
    benefits = clean(product.get("verified_benefits"))

    if benefits:
        chunks.append({
            "chunk_id": f"{product_id}_benefits",
            "product_id": product_id,
            "content": (
                f"Produk: {product_name}\n"
                f"Manfaat: {benefits}"
            ),
            "metadata": {
                **base_metadata,
                "chunk_type": "benefits"
            }
        })

    # Bagian 4: Penggunaan
    usage = clean(product.get("verified_usage"))

    if usage:
        chunks.append({
            "chunk_id": f"{product_id}_usage",
            "product_id": product_id,
            "content": (
                f"Produk: {product_name}\n"
                f"Petunjuk Penggunaan: {usage}"
            ),
            "metadata": {
                **base_metadata,
                "chunk_type": "usage"
            }
        })

    # Bagian 5: Bukti dan sumber
    evidence_content = f"""
Produk: {product_name}
Status Bukti: {evidence_status}
Cakupan Bukti: {evidence_scope}
Judul Sumber: {source_title}
URL Sumber: {source_url}
""".strip()

    chunks.append({
        "chunk_id": f"{product_id}_evidence",
        "product_id": product_id,
        "content": evidence_content,
        "metadata": {
            **base_metadata,
            "chunk_type": "evidence"
        }
    })


# Menyimpan hasil chunking ke JSON
json_path = OUTPUT_DIR / "product_chunks.json"

with open(json_path, "w", encoding="utf-8") as file:
    json.dump(
        chunks,
        file,
        ensure_ascii=False,
        indent=4
    )


# Menyimpan hasil chunking ke JSONL
jsonl_path = OUTPUT_DIR / "product_chunks.jsonl"

with open(jsonl_path, "w", encoding="utf-8") as file:
    for chunk in chunks:
        file.write(
            json.dumps(chunk, ensure_ascii=False) + "\n"
        )


# Menghitung jumlah setiap jenis chunk
chunk_types = {}

for chunk in chunks:
    chunk_type = chunk["metadata"]["chunk_type"]
    chunk_types[chunk_type] = chunk_types.get(chunk_type, 0) + 1


# Menampilkan hasil
print("Chunking berhasil!")
print(f"Jumlah produk: {len(products)}")
print(f"Jumlah seluruh chunk: {len(chunks)}")

print("\nJumlah chunk berdasarkan jenis:")

for chunk_type, total in chunk_types.items():
    print(f"{chunk_type}: {total}")

print(f"\nFile JSON: {json_path}")
print(f"File JSONL: {jsonl_path}")

print("\nCONTOH CHUNK:")
print(json.dumps(
    chunks[0],
    ensure_ascii=False,
    indent=4
))
