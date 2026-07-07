import React, { useState, useRef, useEffect } from "react";
import { queryCivicAI } from "../utils/aiEngine";

export default function AIChat({ lang, apiKey }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef(null);

  const initialGreetings = {
    en: "Hello! I am your AI Civic Companion. How can I help you access municipal services or report public issues today?",
    es: "¡Hola! Soy su Compañero Cívico de IA. ¿Cómo puedo ayudarle a acceder a los servicios municipales o reportar problemas públicos hoy?",
    hi: "नमस्ते! मैं आपका एआई नागरिक साथी हूं। आज मैं सरकारी सेवाओं तक पहुंचने या सार्वजनिक समस्याओं की रिपोर्ट करने में आपकी क्या मदद कर सकता हूं?",
    fr: "Bonjour! Je suis votre compagnon civique IA. Comment puis-je vous aider à accéder aux services municipaux ou à signaler des problèmes publics aujourd'hui?",
    ar: "مرحباً! أنا رفيقك المدني المدعوم بالذكاء الاصطناعي. كيف يمكنني مساعدتك في الوصول إلى الخدمات البلدية أو الإبلاغ عن المشكلات العامة اليوم؟",
    zh: "您好！我是您的 AI 市民助手。今天我该如何协助您获取市政服务或反映公共问题？"
  };

  const chips = {
    en: ["Renew Passport Guide", "Register a Business", "Utility Subsidy Help", "Voter Registration Rules"],
    es: ["Guía de Pasaporte", "Registrar un Negocio", "Subsidio de Servicios", "Reglas de Votante"],
    hi: ["पासपोर्ट गाइड", "व्यवसाय पंजीकृत करें", "उपयोगिता सब्सिडी", "मतदाता पंजीकरण"],
    fr: ["Guide de Passeport", "Créer une Entreprise", "Aide aux Services", "Règles d'Électeur"],
    ar: ["دليل جواز السفر", "تسجيل عمل تجاري", "دعم فواتير الكهرباء", "قواعد تسجيل الناخبين"],
    zh: ["护照换发指南", "注册公司执照", "公用事业补贴", "选民登记规则"]
  };

  // Reset chat / Set first message on language change
  useEffect(() => {
    setMessages([
      {
        id: "greet",
        sender: "ai",
        text: initialGreetings[lang] || initialGreetings.en,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await queryCivicAI(text, lang, apiKey);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeechSimulation = () => {
    if (isRecording) return;
    setIsRecording(true);
    
    // Voice prompt options based on language
    const samplePrompts = {
      en: "How do I register a local LLC business in my city?",
      es: "¿Cómo me registro para votar en las próximas elecciones?",
      hi: "मुझे पासपोर्ट रिन्यू कराने के लिए क्या चाहिए?",
      fr: "Quels sont les documents requis pour le passeport?",
      ar: "ما هي شروط التقديم على السكن الاقتصادي؟",
      zh: "如何申请低收入家庭水电气费用减免补助？"
    };

    setTimeout(() => {
      setInputValue(samplePrompts[lang] || samplePrompts.en);
      setIsRecording(false);
    }, 2200);
  };

  // Helper to parse markdown-like structures to render bullet points, lists, bold text
  const parseMarkdown = (content) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let element = line;

      // Handle Bold markers "**"
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} style={{ color: "var(--accent-secondary)" }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const contentNode = parts.length > 0 ? parts : line;

      // Handle Bullet points "- "
      if (line.trim().startsWith("- ")) {
        return (
          <li key={idx} style={{ marginLeft: "1.25rem", listStyleType: "square", marginVertical: "0.25rem" }}>
            {line.substring(2)}
          </li>
        );
      }

      // Handle Numbered steps "1. ", "2. "
      const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} style={{ display: "flex", gap: "0.5rem", margin: "0.35rem 0" }}>
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              color: "white",
              fontSize: "0.75rem",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              flexShrink: 0,
              marginTop: "4px"
            }}>{numMatch[1]}</span>
            <span>{numMatch[2]}</span>
          </div>
        );
      }

      // Handle section headings (e.g. "📋 Required Documents")
      if (line.trim().startsWith("📋") || line.trim().startsWith("🚶") || line.trim().startsWith("⏱") || line.trim().startsWith("💵") || line.trim().startsWith("📝")) {
        return (
          <h4 key={idx} style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "1.05rem", color: "var(--accent-primary)" }}>
            {contentNode}
          </h4>
        );
      }

      // Default line return
      return (
        <p key={idx} style={{ minHeight: "1rem", margin: "0.25rem 0" }}>
          {contentNode}
        </p>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", gap: "1rem" }}>
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>AI Companion</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Get instant step-by-step assistance, guidelines translation, and query responses.
        </p>
      </div>

      {/* Chat Messages */}
      <div
        className="card"
        style={{
          flexGrow: 1,
          marginBottom: 0,
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflowY: "auto",
          height: "100%",
          maxHeight: "60vh",
          scrollBehavior: "smooth"
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "75%",
              animation: "fadeIn 0.25s ease-out"
            }}
          >
            {/* Sender Label */}
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "0.25rem",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              {msg.sender === "user" ? "You" : "Civic Assistant Companion"} • {msg.time}
            </span>

            {/* Bubble */}
            <div
              style={{
                padding: "0.85rem 1.25rem",
                borderRadius: "14px",
                borderTopRightRadius: msg.sender === "user" ? "2px" : "14px",
                borderTopLeftRadius: msg.sender === "ai" ? "2px" : "14px",
                background: msg.sender === "user" 
                  ? "linear-gradient(135deg, var(--accent-primary), rgba(59, 130, 246, 0.8))"
                  : "var(--bg-input)",
                border: msg.sender === "ai" ? "1px solid var(--border-color)" : "none",
                color: "var(--text-primary)",
                fontSize: "0.95rem"
              }}
            >
              {msg.sender === "user" ? msg.text : parseMarkdown(msg.text)}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", flexDirection: "column", alignSelf: "flex-start" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
              Companion is thinking...
            </span>
            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "14px",
                borderTopLeftRadius: "2px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                display: "flex",
                gap: "4px",
                alignItems: "center"
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)", animation: "floatPulse 1.2s infinite 0.1s" }}></div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)", animation: "floatPulse 1.2s infinite 0.3s" }}></div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)", animation: "floatPulse 1.2s infinite 0.5s" }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Action Chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {(chips[lang] || chips.en).map((chipText, i) => (
          <button
            key={i}
            className="btn btn-secondary"
            onClick={() => handleSend(chipText)}
            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", borderRadius: "20px" }}
          >
            🔍 {chipText}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
      >
        <div style={{ position: "relative", flexGrow: 1 }}>
          <input
            type="text"
            className="form-input"
            placeholder={
              isRecording 
                ? "🎙️ Simulating voice recognition..." 
                : "Ask about documents, services, rules, utilities..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isRecording}
            style={{
              paddingRight: "50px",
              height: "48px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
              border: isRecording ? "1px solid var(--accent-secondary)" : ""
            }}
          />

          {/* Voice Simulator Button */}
          <button
            type="button"
            onClick={handleSpeechSimulation}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isRecording ? "var(--danger)" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center"
            }}
            title="Simulate Voice Input"
          >
            {isRecording ? (
              <span className="voice-pulse" style={{ display: "flex", gap: "2px" }}>
                <span style={{ width: "3px", height: "15px", background: "var(--danger)", animation: "floatPulse 0.5s infinite" }}></span>
                <span style={{ width: "3px", height: "20px", background: "var(--danger)", animation: "floatPulse 0.5s infinite 0.1s" }}></span>
                <span style={{ width: "3px", height: "10px", background: "var(--danger)", animation: "floatPulse 0.5s infinite 0.2s" }}></span>
              </span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "22px", height: "22px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: "48px", width: "48px", borderRadius: "10px", padding: 0 }} disabled={isRecording}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", height: "20px", transform: "rotate(-45deg)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
