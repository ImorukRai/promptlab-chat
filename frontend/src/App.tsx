
import { useState } from "react";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import ChatMessages, {
  type ChatMessage,
} from "./components/ChatMessages/ChatMessages";
import MessageInput from "./components/MessageInput/MessageInput";
import "./App.css";

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
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend(content: string) {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages.map(
              ({ role, content }) => ({ role, content })
            ),
          }),
        }
      );

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
    <div className="app">
      <section className="chat-container">
        <ChatHeader />

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

        <MessageInput
          onSend={handleSend}
          disabled={isLoading}
        />
      </section>
    </div>
  );
}
