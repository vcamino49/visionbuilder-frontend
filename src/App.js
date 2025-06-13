import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setLoading(true);
    const res = await fetch("https://back-end-done.onrender.com/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });
    const data = await res.json();
    if (data.text) setMessages(msgs => [...msgs, { role: "assistant", content: data.text }]);
    if (data.image_url) setImage(data.image_url);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Vision Builder</h1>
      <div className="chat">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Vision Builder"}:</strong> {msg.content}
          </div>
        ))}
        {image && <img src={image} alt="Generated" className="response-img" />}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask Vision Builder..."
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default App;
