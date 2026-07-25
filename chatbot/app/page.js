"use client";

import React, { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const prompt = input;

    const userMessage = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      // API Error
      if (!response.ok) {
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : data?.error?.message ||
              data?.message ||
              "Something went wrong.";

        setError(errorMessage);
        return;
      }

      // Success
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
          },
        ]);
      } else {
        setError(
          typeof data?.error === "string"
            ? data.error
            : data?.error?.message || "Something went wrong."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  const formatMessage = (text = "") => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Hello</h1>

          <button onClick={clearChat} className="clear-btn">
            Clear Chat
          </button>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome</h2>
              <p>Ask me anything.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.role === "user" ? "user-message" : "ai-message"
                }`}
              >
                <div className="message-content">
                  <div className="message-text">
                    {formatMessage(msg.content)}
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            className="send-btn"
            disabled={loading || !input.trim()}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;