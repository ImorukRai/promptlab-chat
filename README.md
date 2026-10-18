# PromptLab Chat

<img width="1437" height="847" alt="image" src="https://github.com/user-attachments/assets/c22101de-2dd2-4527-8f60-511b1887329b" />


Um projeto de chat com Inteligência Artificial desenvolvido para explorar agentes conversacionais e experimentar como diferentes instruções influenciam as respostas de um modelo de linguagem.

## Tecnologias

- **React + TypeScript:** interface do chat e editor de prompts.
- **Python + FastAPI:** backend responsável pelo processamento das mensagens e integração com o modelo.
- **OpenRouter:** API utilizada para acessar modelos de linguagem (LLMs).
- **HTTPX:** comunicação entre o backend e o OpenRouter.

## Agentes de IA

O projeto explora o uso de *system prompts*, instruções que definem o comportamento, os objetivos e as regras de um agente de IA.

A interface permite editar o prompt em tempo real e testar como as alterações afetam as respostas. As modificações são temporárias e o prompt original é restaurado ao atualizar a página.

A implementação atual é um agente conversacional baseado em LLM, servindo como ponto de partida para estudar conceitos como ferramentas, memória e automação de tarefas.

## Como executar

**Backend:**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Configure a variável `OPENROUTER_API_KEY` no arquivo `backend/.env`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Objetivo

Estudar e experimentar conceitos de engenharia de agentes de IA, integração com LLMs e desenvolvimento de aplicações full-stack.
