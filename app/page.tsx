"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "agent";
  text: string;
  tools?: string[];
};

const tools = [
  {
    icon: "🔎",
    name: "Web Search",
    desc: "Looks up current information online",
  },
  {
    icon: "🧮",
    name: "Calculator",
    desc: "Runs quick numeric calculations",
  },
  {
    icon: "🗓️",
    name: "Calendar",
    desc: "Checks or schedules events",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);

  async function sendMessage() {
    const question = input.trim();

    if (!question || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    // Keep the same session ID for the current browser session
    const sessionId =
      sessionStorage.getItem("researchSessionId") ||
      crypto.randomUUID();

    sessionStorage.setItem("researchSessionId", sessionId);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          sessionId,
          metadata: {
            source: "ai-research-assistant",
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      const answer =
        data.output ||
        data.text ||
        data.response ||
        data.reply ||
        data.message ||
        data.answer ||
        "No response received.";

      const usedTools = Array.isArray(data.toolsUsed)
        ? data.toolsUsed
        : [];

      setActiveTools(usedTools);

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: answer,
          tools: usedTools,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "I couldn't connect to the research agent. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
  sessionStorage.removeItem("researchSessionId");
  setMessages([]);
  setActiveTools([]);
}

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>

          <div>
            <div className="brand-name">AI Research Assistant</div>
            <div className="brand-sub">Workflow console</div>
          </div>
        </div>

        <div className="sidebar-scroll">
          <div className="section-label">Capabilities</div>

          <ul className="tool-list">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className={`tool-node ${
                  activeTools.some(
                    (name) =>
                      name.toLowerCase() ===
                      tool.name.toLowerCase()
                  )
                    ? "active"
                    : ""
                }`}
              >
                <div className="tool-icon">
                  {tool.icon}
                  <span className="tool-dot" />
                </div>

                <div>
                  <div className="tool-name">{tool.name}</div>
                  <div className="tool-desc">{tool.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <span className="status-dot" />
          <span>Production Agent</span>
        </div>
      </aside>

      <section className="chat-pane">
        <header className="chat-header">
          <div>
            <div className="chat-title">
              AI Research Assistant
            </div>

            <div className="chat-sub">
              Research · Analysis · Decision Support
            </div>
          </div>

          <button
            className="clear-button"
            onClick={clearChat}
          >
            Clear chat
          </button>
        </header>

        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <div className="welcome-title">
                How can I help you?
              </div>

              <div className="welcome-text">
                Ask a research question and the agent can use
                its connected tools to help answer it.
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.role === "user"
                  ? "message-user"
                  : "message-agent"
              }`}
            >
              <div className="message-meta">
                {message.role === "user"
                  ? "You"
                  : "AI Research Assistant"}
              </div>

              {message.tools &&
                message.tools.length > 0 && (
                  <div className="message-tools">
                    {message.tools.map((tool) => (
                      <span
                        className="tool-chip"
                        key={tool}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

              <div className="message-bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message message-agent">
              <div className="message-meta">
                AI Research Assistant
              </div>

              <div className="typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        <div className="composer">
          <div className="composer-row">
            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message your research assistant..."
              rows={1}
            />

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={
                loading || !input.trim()
              }
            >
              ➤
            </button>
          </div>

          <div className="composer-hint">
            Enter to send · Shift + Enter for a new line
          </div>
        </div>
      </section>
    </main>
  );
}