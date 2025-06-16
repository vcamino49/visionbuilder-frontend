import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendPrompt = async (promptText, history) => {
    setLoading(true);
    const res = await fetch("https://back-end-done.onrender.com/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptText,
        history: history.map(m => m.role + ": " + m.content).join("\n")
      })
    });
    const data = await res.json();
    setMessages(prev => [...prev, {
      role: "assistant",
      content: data.text,
      image_url: data.image_url,
      originalPrompt: promptText
    }]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    let finalPrompt = input;
    let basePrompt = input;

    if (editingIndex !== null) {
      basePrompt = messages[editingIndex].originalPrompt || messages[editingIndex].content;
      finalPrompt = basePrompt + ". " + input;
    }

    const newUserMsg = { role: "user", content: input };
    const updatedMessages = [...messages, newUserMsg];

    setMessages(updatedMessages);
    setInput("");
    setEditingIndex(null);

    await sendPrompt(finalPrompt, updatedMessages);
  };

  const handleEdit = (index) => {
    setInput("");
    setEditingIndex(index);
  };

  return (
    <div className="app">
      <header><h1>Vision Builder</h1></header>
      <main ref={chatRef} className="chat-area">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="bubble">
              {msg.content}
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
        {editingIndex !== null && (
          <div className="edit-context">
            Editing image: <em>{messages[editingIndex]?.originalPrompt || messages[editingIndex]?.content}</em>
          </div>
        )}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={editingIndex !== null ? "Refine this image..." : "Send a prompt..."}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </footer>
    </div>
  );
}

export default App;