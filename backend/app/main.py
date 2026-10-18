
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from httpx import HTTPError
from pydantic import BaseModel, Field

from app.agent import generate_response, get_system_prompt


app = FastAPI(
    title="PromptLab Chat API",
    description="Backend do chatbot PromptLab",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=10000)


class ChatRequest(BaseModel):
    messages: list[Message] = Field(min_length=1, max_length=100)


class ChatResponse(BaseModel):
    role: Literal["assistant"] = "assistant"
    content: str


@app.get("/")
def health_check():
    """Verifica se a API está funcionando."""
    return {
        "status": "ok",
        "service": "PromptLab Chat API",
    }


@app.get("/api/prompt")
def get_prompt():
    """Retorna o prompt do agente para o painel de visualização."""
    try:
        return {"prompt": get_system_prompt()}
    except OSError as error:
        raise HTTPException(
            status_code=500,
            detail="Não foi possível carregar o prompt do agente.",
        ) from error


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Recebe o histórico da conversa e retorna uma resposta da LLM."""

    if request.messages[-1].role != "user":
        raise HTTPException(
            status_code=400,
            detail="A última mensagem deve ser do usuário.",
        )

    try:
        history = [
            message.model_dump()
            for message in request.messages
        ]

        answer = generate_response(history)

        return ChatResponse(content=answer)

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error

    except HTTPError as error:
        raise HTTPException(
            status_code=502,
            detail="Não foi possível obter uma resposta da LLM.",
        ) from error

    except (KeyError, IndexError, TypeError, ValueError) as error:
        raise HTTPException(
            status_code=502,
            detail="A resposta do provedor veio em formato inesperado.",
        ) from error
