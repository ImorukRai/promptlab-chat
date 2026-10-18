
import "./ChatMessages.css";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessagesProps = {
  messages: ChatMessage[];
};

export default function ChatMessages({
  messages,
}: ChatMessagesProps) {
  return (
    <main className="chat-messages" aria-live="polite">
      <p className="chat-date">Hoje</p>

      {messages.map((message) => (
        <div
          key={message.id}
          className={`message-row ${message.role}`}
        >
          <div className="message-bubble">
            {message.content}
          </div>
        </div>
      ))}
    </main>
  );
}
