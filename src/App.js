import React, { useState, useRef, useEffect } from "react";
import "./index.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendPrompt = async () => {
    if (!input.trim()) return;

    const basePrompt = editingIndex !== null
      ? messages[editingIndex].originalPrompt || messages[editingIndex].content
      : input;

    const combinedPrompt = editingIndex !== null
      ? basePrompt + ". " + input
      : input;

    const newUserMsg = { role: "user", content: input };
    const updatedMessages = [...messages, newUserMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setEditingIndex(null);

    const res = await fetch("https://back-end-done.onrender.com/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: combinedPrompt,
        history: updatedMessages.map(m => m.role + ": " + m.content).join("\n"),
        mode
      })
    });

    const data = await res.json();
    setMessages(prev => [...prev, {
      role: "assistant",
      content: data.text,
      image_url: data.image_url,
      originalPrompt: combinedPrompt
    }]);
    setLoading(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setInput("");
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
              {msg.image_url && (
                <div>
                  <img src={msg.image_url} alt="Generated" className="chat-image" />
                  <button onClick={() => handleEdit(i)}>✏️ Edit</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="bubble assistant">Thinking...</div>}
      </main>
      <footer>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={editingIndex !== null ? "Refine this image..." : "Describe what to build..."}
        />
        <button onClick={sendPrompt} disabled={loading}>Generate</button>
      </footer>
    </div>
  );
}