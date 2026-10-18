
import { useState, type FormEvent } from "react";
import "./MessageInput.css";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function MessageInput({
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = message.trim();

    if (!content || disabled) return;

    onSend(content);
    setMessage("");
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Envie uma mensagem..."
        aria-label="Digite sua mensagem"
        autoComplete="off"
        disabled={disabled}
      />

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        aria-label="Enviar mensagem"
        title="Enviar mensagem"
      >
        ➤
      </button>
    </form>
  );
}
