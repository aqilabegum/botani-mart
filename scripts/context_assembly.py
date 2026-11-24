
def build_context(retrieved_chunks):
    """
    Menggabungkan hasil retrieval menjadi context
    yang akan diberikan kepada Gemini API.
    """

    if not retrieved_chunks:
        return "Tidak ditemukan informasi yang relevan dalam knowledge base Botani Mart."

    context_parts = []

    for index, chunk in enumerate(retrieved_chunks, start=1):
        metadata = chunk.get("metadata", {})

        content = chunk.get("content", "")

        product_name = metadata.get("product_name", "Tidak diketahui")
        product_id = metadata.get("product_id", "Tidak diketahui")
        category = metadata.get("category", "Tidak diketahui")
        chunk_type = metadata.get("chunk_type", "Tidak diketahui")
        evidence_status = metadata.get(
            "evidence_status",
            "Status bukti tidak tersedia"
        )
        source_title = metadata.get("source_title", "Tidak tersedia")
        source_url = metadata.get("source_url", "Tidak tersedia")

        context = f"""
[INFORMASI {index}]

Nama Produk: {product_name}
ID Produk: {product_id}
Kategori: {category}
Jenis Informasi: {chunk_type}

Isi Informasi:
{content}

Status Bukti: {evidence_status}
Sumber: {source_title}
URL Sumber: {source_url}
"""

        context_parts.append(context.strip())

    return "\n\n".join(context_parts)


if __name__ == "__main__":
    import json

    with open(
        "knowledge_base/product_chunks.json",
        "r",
        encoding="utf-8"
    ) as file:
        chunks = json.load(file)

    # Contoh pengujian menggunakan satu chunk
    sample_chunks = chunks[:1]

    context = build_context(sample_chunks)

    print("=== HASIL CONTEXT ASSEMBLY ===")
    print(context)
