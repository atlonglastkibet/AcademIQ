import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your AcademIQ Assistant. How can I help you learn today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      
      const fullMessages = [
        {
          role: "system",
          content: `
            You are "AcademIQ" — a friendly, knowledgeable academic AI assistant for students.
            You help users with subjects like math, science, programming, languages, and study skills.
            You explain clearly, encourage curiosity, and avoid giving direct answers to exams.
            Use simple, student-friendly tone and examples.
          `
        },
        
        ...messages.slice(1).map(msg => ({ role: msg.role, content: msg.content })), 
        { role: "user", content: userMessage }
      ];


      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: fullMessages,
      });

      const reply = response.choices[0].message.content;

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, something went wrong. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "👋 Hi! I'm your AcademIQ Assistant. What subject are you studying today?" }]);
  };

  return (
    <div>
     
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white w-16 h-16 rounded-full shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 transform hover:scale-105 z-50"
        aria-label="Toggle chat"
        title={open ? "Close Chat" : "Open Chat"}
      >
        {open ? (
          <span className="text-2xl font-bold">✕</span>
        ) : (
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.69A9.705 9.705 0 015 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        )}
      </button>

      
      {open && (
        <div 
            className="fixed bottom-24 right-6 w-80 max-h-[85vh] bg-white shadow-3xl rounded-xl border border-gray-100 z-40 overflow-hidden transform transition-all duration-300 ease-out animate-slideIn"
            style={{ 
                
                transform: 'translateY(0)', 
                opacity: 1 
            }}
        >
          
         
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 shadow-md flex justify-between items-center sticky top-0">
            <h3 className="font-bold text-lg">AcademIQ Assistant</h3>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="text-white hover:text-blue-200 p-1 rounded-full transition-colors"
                title="Start a New Chat"
              >
                
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 19.94H4v-5m.582-10.44l-.582-.01m.012 2.5l-.012-.01"></path></svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-blue-200 p-1 rounded-full transition-colors"
                title="Close Chat"
              >
                
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>

         
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-200" 
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-3 py-2 rounded-xl text-sm border border-gray-200">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-3 bg-white sticky bottom-0">
            <div className="flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-full pl-4 pr-1 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ask your question..."
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
                aria-label="Send message"
                title="Send Message"
              >
                
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FloatingChat;