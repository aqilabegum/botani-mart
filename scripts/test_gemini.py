
import os
from dotenv import load_dotenv
from google import genai


# 1. Membaca konfigurasi dari file .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL")

# 2. Memeriksa konfigurasi
if not api_key:
    raise ValueError("GEMINI_API_KEY tidak ditemukan di file .env")

if not model_name:
    raise ValueError("GEMINI_MODEL tidak ditemukan di file .env")


# 3. Membuat Gemini Client
client = genai.Client(api_key=api_key)


# 4. Mengirim pertanyaan ke Gemini
question = "Apa itu RAG dan bagaimana cara kerjanya?"

print("Menghubungkan ke Gemini API...")
print("Model:", model_name)

response = client.models.generate_content(
    model=model_name,
    contents=question
)


# 5. Menampilkan jawaban
print("\n=== JAWABAN GEMINI ===")
print(response.text)

print("\nGEMINI API BERHASIL TERHUBUNG!")
