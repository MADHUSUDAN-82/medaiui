"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);


  const API_URL = "http://127.0.0.1:5000/ask"; // Flask backend

  const sendMessage = async () => {
  if (!input.trim()) return;

  const question = input;

  // Add the user's message (correct role)
  setMessages((prev) => [...prev, { role: "user", content: question }]);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    const answer = data.answer || "No response from backend.";

    // Add assistant's message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: answer },
    ]);
  } catch (error: any) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "⚠️ Backend not reachable." },
    ]);
  }

  setLoading(false);
};


  return (
    <main className="flex flex-col items-center min-h-screen bg-[#0f172a] p-6">

  <div className="w-full max-w-2xl bg-[#1e293b] shadow-xl rounded-xl p-6 border border-gray-700">

    <header className="flex justify-between items-center pb-4 border-b border-gray-600 mb-4">
      <h1 className="text-2xl font-bold text-blue-400">🩺 Medical AI Assistant</h1>
    </header>

    {/* Chat Window */}
    <div
  ref={chatWindowRef}
  className="hide-scrollbar h-[60vh] overflow-y-auto space-y-3 p-2 bg-[#0f172a] rounded-lg border border-gray-700"
>
  {messages.map((msg, idx) => (
    <div key={idx} className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
      
      {/* Avatar */}
      <span className="text-2xl">
        {msg.role === "user" ? "🧑" : "🤖"}
      </span>

      {/* Bubble */}
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] text-sm shadow ${
          msg.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-[#334155] text-gray-100"
        }`}
      >
        <pre className="whitespace-pre-wrap">{msg.content}</pre>
      </div>
    </div>
  ))}

  {loading && (
    <div className="flex items-center gap-2 text-gray-300">
      <span className="text-2xl">🤖</span>
      <div className="px-4 py-2 rounded-lg bg-[#334155]">Typing...</div>
    </div>
  )}
</div>


    {/* Input */}
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Ask a medical question..."
        className="flex-grow bg-[#0f172a] border border-gray-600 text-gray-100 rounded-lg p-3 
                   focus:ring-2 focus:ring-blue-500 outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>

  </div>
</main>


  );
}
