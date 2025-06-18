import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendPrompt = async () => {
    if (!input.trim()) return;
    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("https://back-end-done.onrender.com/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: input,
        history: updatedMessages.map(m => m.role + ": " + m.content).join("\n"),
        mode
      })
    });
    const data = await res.json();
    setMessages(prev => [...prev, {
      role: "assistant",
      content: data.text,
      image_url: data.image_url
    }]);
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>Vision Builder</h1>
        <div className="mode-toggle">
          <label>
            <input type="radio" value="realistic" checked={mode === "realistic"} onChange={() => setMode("realistic")} />
            Realistic
          </label>
          <label>
            <input type="radio" value="stylized" checked={mode === "stylized"} onChange={() => setMode("stylized")} />
            Stylized
          </label>
        </div>
      </header>
      <main ref={chatRef} className="chat-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="bubble">
              <p>{msg.content}</p>
              {msg.image_url && <img src={msg.image_url} alt="Generated" className="chat-image" />}
            </div>
          </div>
        ))}
        {loading && <div className="bubble assistant">Thinking...</div>}
      </main>
      <footer>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Describe what to build..." />
        <button onClick={sendPrompt} disabled={loading}>Generate</button>
      </footer>
    </div>
  );
}