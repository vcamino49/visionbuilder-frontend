import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://back-end-done.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      const botMsg = {
        role: "assistant",
        content: data.text || "",
        image_url: data.image_url || null
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error("Error generating:", e);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <img src="logo.png" alt="Vision Builder" className="logo" />
        <h1>Vision Builder</h1>
      </header>
      <main ref={chatRef} className="chat-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="bubble">
              {msg.content}
              {msg.image_url && (
                <img src={msg.image_url} alt="Generated visual" className="chat-image" />
              )}
            </div>
          </div>
        ))}
        {loading && <div className="loading">Thinking...</div>}
      </main>
      <footer>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message..."
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </footer>
    </div>
  );
}

export default App;
