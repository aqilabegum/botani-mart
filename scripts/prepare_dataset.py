
import pandas as pd
import json
from pathlib import Path

# Menentukan lokasi folder project
BASE_DIR = Path(__file__).resolve().parent.parent

# Lokasi dataset
DATA_PATH = BASE_DIR / "data" / "dataset_botani_mart.csv"

# Folder output
OUTPUT_DIR = BASE_DIR / "knowledge_base"
OUTPUT_DIR.mkdir(exist_ok=True)

# Membaca dataset
df = pd.read_csv(DATA_PATH)

# Memastikan kolom utama tersedia
required_columns = [
    "product_id",
    "category",
    "product_name",
    "catalog_price",
    "verified_description",
    "verified_benefits",
    "verified_usage",
    "evidence_status",
    "evidence_scope",
    "official_source_title",
    "official_source_url"
]

missing_columns = [
    col for col in required_columns
    if col not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Kolom tidak ditemukan: {missing_columns}"
    )

# Mengubah dataset menjadi daftar dokumen
products = []

for _, row in df.iterrows():
    product = {}

    for col in df.columns:
        value = row[col]

        if pd.isna(value):
            value = None
        elif hasattr(value, "item"):
            value = value.item()

        product[col] = value

    products.append(product)

# Menyimpan JSON
json_path = OUTPUT_DIR / "products.json"

with open(json_path, "w", encoding="utf-8") as file:
    json.dump(
        products,
        file,
        ensure_ascii=False,
        indent=4
    )

# Menyimpan JSONL
jsonl_path = OUTPUT_DIR / "products.jsonl"

with open(jsonl_path, "w", encoding="utf-8") as file:
    for product in products:
        file.write(
            json.dumps(product, ensure_ascii=False) + "\n"
        )

# Menampilkan hasil
print("Preprocessing dataset berhasil!")
print(f"Jumlah produk: {len(products)}")
print(f"Jumlah kolom: {len(df.columns)}")
print(f"File JSON: {json_path}")
print(f"File JSONL: {jsonl_path}")
