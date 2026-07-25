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

    const userMessage = { role: "user", content: input };
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
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
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
                className={`message ${msg.role === "user" ? "user-message" : "ai-message"}`}
              >
                <div className="message-content">
                  {/* <div className="message-avatar">
                    {msg.role === "user" ? "You" : "AI"}
                  </div> */}
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

          {error && <div className="error-message">{error}</div>}

          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            {loading ? "loading" : "send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
