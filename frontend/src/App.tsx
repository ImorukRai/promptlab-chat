
import { useEffect, useState } from "react";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import ChatMessages, {
  type ChatMessage,
} from "./components/ChatMessages/ChatMessages";
import MessageInput from "./components/MessageInput/MessageInput";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Oi! Sou seu assistente de IA. Como posso ajudar?",
  },
];

export default function App() {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [prompt, setPrompt] = useState("");
  const [isPromptLoaded, setIsPromptLoaded] = useState(false);
  const [promptError, setPromptError] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPrompt() {
      try {
        const response = await fetch(`${API_URL}/api/prompt`);

        if (!response.ok) {
          throw new Error("Não foi possível carregar o prompt.");
        }

        const data: { prompt: string } = await response.json();

        setPrompt(data.prompt);
        setPromptError("");
      } catch {
        setPromptError(
          "Falha ao carregar o prompt. Verifique se o backend está rodando."
        );
      } finally {
        setIsPromptLoaded(true);
      }
    }

    loadPrompt();
  }, []);

  async function handleSend(content: string) {
    if (isLoading || !isPromptLoaded || promptError) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({
            role,
            content,
          })),
          system_prompt: prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail ?? "Falha ao consultar o agente."
        );
      }

      const data: { role: "assistant"; content: string } =
        await response.json();

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível conectar ao agente.";

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Erro: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app">
      <div
        className={`workspace ${
          isPromptOpen ? "workspace--prompt-open" : ""
        }`}
      >
        <section className="chat-container">
          <ChatHeader />

          <div className="chat-toolbar">
            <span className="chat-toolbar__label">
              Conversa com o agente
            </span>

            <button
              className={`prompt-toggle ${
                isPromptOpen ? "prompt-toggle--active" : ""
              }`}
              onClick={() => setIsPromptOpen((open) => !open)}
              aria-expanded={isPromptOpen}
              aria-controls="prompt-panel"
            >
              {isPromptOpen ? "Ocultar prompt" : "Ver prompt"}
            </button>
          </div>

          <ChatMessages
            messages={
              isLoading
                ? [
                    ...messages,
                    {
                      id: "loading",
                      role: "assistant" as const,
                      content: "Pensando...",
                    },
                  ]
                : messages
            }
          />

          {promptError && (
            <p className="prompt-error">{promptError}</p>
          )}

          <MessageInput
            onSend={handleSend}
            disabled={isLoading || !isPromptLoaded || !!promptError}
          />
        </section>

        {isPromptOpen && (
          <aside
            id="prompt-panel"
            className="prompt-panel"
            aria-label="Editor do prompt do agente"
          >
            <div className="prompt-panel__header">
              <div>
                <h2>System prompt</h2>
                <p>Edite as instruções do agente.</p>
              </div>

              <button
                className="prompt-close"
                onClick={() => setIsPromptOpen(false)}
                aria-label="Fechar editor do prompt"
              >
                ×
              </button>
            </div>

            <textarea
              className="prompt-editor"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={
                isPromptLoaded
                  ? "Escreva as instruções do agente..."
                  : "Carregando prompt..."
              }
              disabled={!isPromptLoaded || !!promptError}
              spellCheck
            />

            <div className="prompt-panel__footer">
              <span>
                {prompt.length.toLocaleString("pt-BR")} caracteres
              </span>
              <span>Alterações temporárias</span>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
