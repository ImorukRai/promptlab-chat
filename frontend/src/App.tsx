
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

  function handleSend(content: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);

    // Resposta temporária: futuramente chamaremos o backend Python.
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Recebi sua mensagem! Em breve estarei conectado a uma LLM para responder de verdade.",
    };

    setMessages((current) => [...current, assistantMessage]);
  }

  return (
    <div className="app">
      <section className="chat-container">
        <ChatHeader />

        <ChatMessages messages={messages} />

        <MessageInput onSend={handleSend} />
      </section>
    </div>
  );
}
