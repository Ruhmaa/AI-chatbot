import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]); 

  const messagesEndRef = useRef(null);

  const suggestions = [
    "What are some fun facts about the universe?",
    "Write a catchy caption for a travel photo.",
    "Recommend a book for someone who likes mystery.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- UPDATED FOR INSTANT STREAMING & ESLINT COMPLIANCE ---
  const handleSendMessage = async (textOverride) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    // 1. Add User Message and an Empty Bot Message immediately
    const userMessage = { sender: 'user', text: messageText };
    const botPlaceholder = { sender: 'bot', text: "" }; 
    
    setMessages(prev => [...prev, userMessage, botPlaceholder]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.body) throw new Error("No response body");

      // 2. Set up the stream reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        // FIX: Using for...of loop to avoid ESLint 'no-loop-func' warning
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.reply) {
                const newChunk = data.reply;
                
                // 3. Functional update: strictly safe way to update state during loops
                setMessages(prev => {
                  const updatedMessages = [...prev];
                  const lastIndex = updatedMessages.length - 1;
                  
                  // Append new chunk to the existing text of the last message
                  updatedMessages[lastIndex] = { 
                    ...updatedMessages[lastIndex], 
                    text: updatedMessages[lastIndex].text + newChunk 
                  };
                  return updatedMessages;
                });
              }
            } catch (e) {
              // Ignore partial JSON parsing errors during stream
              console.debug("Partial chunk skipped");
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          sender: 'bot', 
          text: "Error: Could not connect to the AI server." 
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setMessages([]); 
    navigate('/'); 
  };

  return (
    <div className="main-wrapper">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          AI-ChatBot
        </div>
        <div className="nav-buttons">
          <button className="btn-signup" onClick={() => setMessages([])}>+ New Chat</button>
          <button className="btn-dark" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="content-area">
        {messages.length === 0 ? (
          <div className="hero-section">
            <div className="bot-icon-wrapper">
              <div className="bot-glow"></div>
              <span className="bot-emoji">🤖</span>
            </div>
            <h1>Chat with <span className="purple-text">AI Intelligence</span></h1>
            <p className="hero-subtitle">
              Transform your content, tailor it to your needs, and experience 
              the next era of digital autonomy.
            </p>

            <div className="suggestions-grid">
              {suggestions.map((s, i) => (
                <button key={i} className="chip" onClick={() => handleSendMessage(s)}>
                  <span className="chip-icon">✨</span> {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-history">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.sender}`}>
                <div className={`msg-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Show 'Thinking...' only if the bot hasn't started streaming text yet */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].text === "" && (
              <div className="msg-row bot">
                <div className="msg-bubble bot loading-dots">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-container">
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Ask our chatbot anything..." 
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-circle-btn" 
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
            >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="white" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </button>
          </div>
        </div>
      </main>

      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
    </div>
  );
}