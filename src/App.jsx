import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { IoSend } from "react-icons/io5";

const App = () => {
  const apikey = import.meta.env.VITE_API_GEMINI_KEY;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  async function fetchChatResponseFromGemini() {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] }),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      const aiResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      const botMessage = { role: "bot", text: aiResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error fetching response" },
      ]);
    } finally {
      setLoading(false);
    }
  }

 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchChatResponseFromGemini();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1
        className="text-3xl font-bold mb-6 text-blue-400"
        style={{ fontFamily: "Yatra One" }}
      >
        Ram Lal AI Chatbot
      </h1>
      <div className="bg-gray-800 p-4 rounded-sm shadow-lg w-full flex flex-col space-y-4">
        {/* Chat Messages */}
        <div className="h-100 overflow-y-auto bg-gray-700 p-3 rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-sm break-words whitespace-pre-wrap max-w-[75%] ${
                msg.role === "user"
                  ? "bg-blue-500 self-end text-white ml-auto"
                  : "bg-gray-600 text-gray-200 self-start"
              }`}
              style={{ width: "fit-content" }} 
            >
              <div className="overflow-hidden break-words whitespace-pre-wrap">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div
              className="self-start bg-gray-600 text-gray-200 p-2 my-1 rounded-sm"
              style={{ width: "fit-content" }}
            >
              Typing<span>{dots}</span>
            </div>
          )}
        </div>

        {/* Input & Button */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="  Type a message..."
            className="flex-grow p-2 border border-gray-600 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchChatResponseFromGemini}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer p-4 rounded-full transition-all"
          >
            <IoSend />
          </button>
        </div>
      </div>
      <p
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-4 sm:mt-6 text-blue-400 text-center px-4"
        style={{ fontFamily: "Yatra One" }}
      >
        कुनाल शर्मा द्वारा बनाया गया है |❤️
      </p>
    </div>
  );
};

export default App;
