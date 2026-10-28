
import React, { useState } from "react";

const ChatBot = ({ panel = "user" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi! Welcome to CareerHub. I'm your ${
        panel.charAt(0).toUpperCase() + panel.slice(1)
      } Assistant. How can I help you?`,
    },
  ]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            panel,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No response received.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {isOpen && (
        <div
          style={{
            width: 330,
            height: 430,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 4px 20px #0002",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 12,
            border: "1px solid #ddd",
          }}
        >
          <div
            style={{
              background: "#4f46e5",
              color: "#fff",
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>CareerHub AI Assistant</strong>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                color: "#fff",
                border: 0,
                cursor: "pointer",
                fontSize: 20,
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              background: "#f8fafc",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background:
                      msg.role === "user"
                        ? "#4f46e5"
                        : "#e5e7eb",
                    color:
                      msg.role === "user" ? "#fff" : "#111827",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <p style={{ color: "#666", fontSize: 13 }}>
                AI is typing...
              </p>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              gap: 8,
              padding: 10,
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1,
                minWidth: 0,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 8,
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: 0,
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          float: "right",
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: 0,
          background: "#4f46e5",
          color: "#fff",
          fontSize: 25,
          cursor: "pointer",
          boxShadow: "0 4px 12px #0003",
        }}
        aria-label="Open CareerHub AI Assistant"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
};

export default ChatBot;
