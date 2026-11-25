from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

from scripts.rag_pipeline import generate_answer


app = FastAPI(
    title="Botani Mart AI Assistant",
    description="API untuk RAG Chatbot Botani Mart",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    question: str
    history: list[HistoryMessage] = Field(default_factory=list)


@app.get("/")
def home():
    return {
        "message": "Botani Mart AI Assistant API berhasil dijalankan!"
    }


@app.post("/chat")
def chat(request: ChatRequest):
    try:
        result = generate_answer(
            question=request.question,
            history=[
                item.model_dump()
                for item in request.history
            ]
        )

        return {
            "question": request.question,
            "answer": result["answer"],
            "retrieved_chunks": result["retrieved_chunks"]
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Terjadi kesalahan pada RAG pipeline: {str(e)}"
        )
