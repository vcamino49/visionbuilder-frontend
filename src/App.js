import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

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
  };

  return (
    <div className="app">
      <header>
        <img src="logo.png" alt="Vision Builder" className="logo" />
        <h1>Vision Builder</h1>
      </header>
      <div className="chat-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="bubble">{msg.content}</div>
            {msg.image_url && <img src={msg.image_url} alt="Result" className="chat-image" />}
          </div>
        ))}
      </div>
      <footer>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Vision Builder..." />
        <button onClick={handleSend}>Send</button>
      </footer>
    </div>
  );
}

export default App;
