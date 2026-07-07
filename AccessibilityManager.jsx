import React, { useState, useEffect } from "react";

export default function AccessibilityManager({ lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [fontScale, setFontScale] = useState(1);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Apply font scale to document element
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", fontScale);
  }, [fontScale]);

  // Attach global mouseover event listener for simulated Screen Reader
  useEffect(() => {
    if (!ttsEnabled) return;

    const speakText = (text) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "es" ? "es-ES" : lang === "hi" ? "hi-IN" : lang === "fr" ? "fr-FR" : lang === "zh" ? "zh-CN" : "en-US";
      window.speechSynthesis.speak(utterance);
    };

    const handleHover = (e) => {
      // Find element or closest interactive parent
      const element = e.target.closest("button, h1, h2, h3, p, label, li, a");
      if (element) {
        // Avoid repeating speech for the same element repeatedly on tiny movements
        const text = element.innerText || element.getAttribute("aria-label") || element.placeholder;
        if (text && element.dataset.lastSpoken !== text) {
          speakText(text);
          element.dataset.lastSpoken = text;
          
          // Clear cached state after leaving element
          element.addEventListener("mouseleave", () => {
            delete element.dataset.lastSpoken;
          }, { once: true });
        }
      }
    };

    document.body.addEventListener("mouseover", handleHover);
    return () => {
      document.body.removeEventListener("mouseover", handleHover);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [ttsEnabled, lang]);

  const languages = [
    { code: "en", label: "English 🇺🇸" },
    { code: "es", label: "Español 🇪🇸" },
    { code: "hi", label: "हिन्दी 🇮🇳" },
    { code: "fr", label: "Français 🇫🇷" },
    { code: "ar", label: "العربية 🇸🇦" },
    { code: "zh", label: "中文 🇨🇳" }
  ];

  const handleSpeakSample = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = lang === "es" ? "Lector de pantalla activado" : lang === "hi" ? "स्क्रीन रीडर सक्रिय" : "Screen reader active";
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          padding: 0,
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
          display: "flex",
          alignItems: "center",
          justifycontent: "center"
        }}
        aria-label="Accessibility Options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "28px", height: "28px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div
          className="card"
          style={{
            position: "absolute",
            bottom: "70px",
            right: 0,
            width: "320px",
            padding: "1.5rem",
            marginBottom: 0,
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            animation: "fadeIn 0.2s ease-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem" }}>Accessibility Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "1.2rem" }}
            >
              &times;
            </button>
          </div>

          {/* Theme Selector */}
          <div className="form-group">
            <label className="form-label">Theme & Contrast</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <button
                className={`btn btn-secondary ${theme === "dark" ? "active-border" : ""}`}
                style={{ fontSize: "0.8rem", padding: "0.5rem", border: theme === "dark" ? "2px solid var(--accent-primary)" : "" }}
                onClick={() => setTheme("dark")}
              >
                Dark Mode
              </button>
              <button
                className={`btn btn-secondary ${theme === "light" ? "active-border" : ""}`}
                style={{ fontSize: "0.8rem", padding: "0.5rem", border: theme === "light" ? "2px solid var(--accent-primary)" : "" }}
                onClick={() => setTheme("light")}
              >
                Light Mode
              </button>
              <button
                className={`btn btn-secondary`}
                style={{ fontSize: "0.8rem", padding: "0.4rem", border: theme === "contrast-dark" ? "2px solid var(--accent-primary)" : "", background: "#000", color: "#ffff00" }}
                onClick={() => setTheme("contrast-dark")}
              >
                Contrast (D)
              </button>
              <button
                className={`btn btn-secondary`}
                style={{ fontSize: "0.8rem", padding: "0.4rem", border: theme === "contrast-light" ? "2px solid var(--accent-primary)" : "", background: "#fff", color: "#000" }}
                onClick={() => setTheme("contrast-light")}
              >
                Contrast (L)
              </button>
            </div>
          </div>

          {/* Font Scale Adjuster */}
          <div className="form-group">
            <label className="form-label">Text Sizing: {Math.round(fontScale * 100)}%</label>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {[1, 1.15, 1.3, 1.5].map((scale) => (
                <button
                  key={scale}
                  className="btn btn-secondary"
                  style={{ flexGrow: 1, padding: "0.4rem 0", fontSize: "0.8rem", border: fontScale === scale ? "2px solid var(--accent-primary)" : "" }}
                  onClick={() => setFontScale(scale)}
                >
                  {scale}x
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="form-group">
            <label className="form-label font-bold">Select Language</label>
            <select
              className="form-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ fontSize: "0.9rem" }}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Screen Reader Simulation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
            <div>
              <span className="form-label" style={{ marginBottom: 0 }}>Screen Reader (TTS)</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Hover over items to read aloud</span>
            </div>
            <button
              className={`btn ${ttsEnabled ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
              onClick={() => {
                const newTts = !ttsEnabled;
                setTtsEnabled(newTts);
                if (newTts) setTimeout(handleSpeakSample, 100);
              }}
            >
              {ttsEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
