import React, { useState, useRef, useEffect } from 'react';
import './App.css';

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
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("https://back-end-done.onrender.com/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: input,
        history: newMessages.map(m => `${m.role}: ${m.content}`).join("\n")
      })
    });
    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.text, image_url: data.image_url }]);
    setLoading(false);
  };

  return (
    <div className="app">
      <header><img src="logo.png" alt="Vision Builder" className="logo"/><h1>Vision Builder</h1></header>
      <main ref={chatRef} className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="bubble">{m.content}</div>
            {m.image_url && <img src={m.image_url} alt="Visual" className="chat-image" />}
          </div>
        ))}
        {loading && <div className="bubble assistant">Thinking...</div>}
      </main>
      <footer>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Vision Builder..." />
        <button onClick={handleSend}>Send</button>
      </footer>
    </div>
  );
}

export default App;
