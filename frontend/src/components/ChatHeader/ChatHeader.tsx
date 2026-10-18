
import "./ChatHeader.css";

export default function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="agent-avatar" aria-label="Avatar do agente">
        🤖
      </div>

      <div className="agent-info">
        <h2>Agente IA</h2>
        <span className="agent-status">
          <span className="status-dot" />
          Online
        </span>
      </div>

      <button
        className="header-button"
        type="button"
        aria-label="Mais opções"
        title="Mais opções"
      >
        ⋯
      </button>
    </header>
  );
}
