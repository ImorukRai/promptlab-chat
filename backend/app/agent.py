
import os
from pathlib import Path

import httpx
from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROMPT_PATH = Path(__file__).parent / "prompts" / "system.txt"

load_dotenv(BACKEND_DIR / ".env")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "openrouter/free"


def get_system_prompt() -> str:
    """Carrega o prompt original salvo no backend."""
    return PROMPT_PATH.read_text(encoding="utf-8")


def generate_response(
    messages: list[dict[str, str]],
    system_prompt: str | None = None,
) -> str:
    """Envia o histórico e o prompt escolhido para a LLM."""

    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        raise RuntimeError(
            "A variável OPENROUTER_API_KEY não foi configurada."
        )

    active_prompt = (
        system_prompt
        if system_prompt is not None
        else get_system_prompt()
    )

    api_messages = [
        {"role": "system", "content": active_prompt},
        *messages,
    ]

    response = httpx.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": MODEL,
            "messages": api_messages,
            "temperature": 0.7,
            "max_tokens": 800,
        },
        timeout=60.0,
    )

    response.raise_for_status()
    data = response.json()

    content = data["choices"][0]["message"]["content"]

    if not isinstance(content, str) or not content.strip():
        raise RuntimeError("O modelo retornou uma resposta vazia.")

    return content
