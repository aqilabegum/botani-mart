
import pandas as pd
import json
from pathlib import Path

# Menentukan lokasi project
BASE_DIR = Path(__file__).resolve().parent.parent

# Lokasi dataset
DATA_PATH = BASE_DIR / "data" / "dataset_botani_mart.csv"

# Lokasi output knowledge base
OUTPUT_DIR = BASE_DIR / "knowledge_base"
OUTPUT_DIR.mkdir(exist_ok=True)

# Membaca dataset
df = pd.read_csv(DATA_PATH)

# Fungsi untuk mengubah nilai kosong menjadi teks aman
def clean_value(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


# Menampung seluruh dokumen
documents = []

for _, row in df.iterrows():

    product_id = clean_value(row["product_id"])
    product_name = clean_value(row["product_name"])
    category = clean_value(row["category"])

    variety = clean_value(row["variety_or_details"])
    price = clean_value(row["catalog_price"])

    description = clean_value(row["verified_description"])
    benefits = clean_value(row["verified_benefits"])
    usage = clean_value(row["verified_usage"])

    evidence_status = clean_value(row["evidence_status"])
    evidence_scope = clean_value(row["evidence_scope"])

    source_title = clean_value(row["official_source_title"])
    source_url = clean_value(row["official_source_url"])

    # Membentuk isi dokumen
    content = f"""
PRODUCT ID: {product_id}

PRODUCT NAME: {product_name}

CATEGORY: {category}

VARIETY OR DETAILS:
{variety if variety else "Belum tersedia"}

CATALOG PRICE:
{price if price else "Belum tersedia"}

VERIFIED DESCRIPTION:
{description if description else "Belum tersedia"}

VERIFIED BENEFITS:
{benefits if benefits else "Belum tersedia"}

VERIFIED USAGE:
{usage if usage else "Belum tersedia"}

EVIDENCE STATUS:
{evidence_status}

EVIDENCE SCOPE:
{evidence_scope}

SOURCE TITLE:
{source_title}

SOURCE URL:
{source_url}
""".strip()

    # Metadata dokumen
    metadata = {
        "product_id": product_id,
        "product_name": product_name,
        "category": category,
        "evidence_status": evidence_status,
        "source_title": source_title,
        "source_url": source_url,
        "document_type": "product_knowledge"
    }

    documents.append({
        "id": product_id,
        "content": content,
        "metadata": metadata
    })


# Menyimpan dokumen dalam format JSON
json_path = OUTPUT_DIR / "product_documents.json"

with open(json_path, "w", encoding="utf-8") as file:
    json.dump(
        documents,
        file,
        ensure_ascii=False,
        indent=4
    )


# Menyimpan dokumen dalam format JSONL
jsonl_path = OUTPUT_DIR / "product_documents.jsonl"

with open(jsonl_path, "w", encoding="utf-8") as file:
    for document in documents:
        file.write(
            json.dumps(document, ensure_ascii=False) + "\n"
        )


# Menampilkan hasil
print("Knowledge Base berhasil dibuat!")
print(f"Jumlah dokumen: {len(documents)}")
print(f"File JSON: {json_path}")
print(f"File JSONL: {jsonl_path}")

# Menampilkan contoh dokumen pertama
print("\nCONTOH DOKUMEN:")
print(json.dumps(
    documents[0],
    ensure_ascii=False,
    indent=4
))
