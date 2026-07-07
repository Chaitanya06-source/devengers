import React, { useState } from "react";

export default function DeveloperSettings({ apiKey, setApiKey }) {
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(tempKey);
    setTestResult("✅ Key saved successfully!");
    setTimeout(() => setTestResult(""), 3000);
  };

  const handleTestConnection = async () => {
    if (!tempKey.trim()) {
      setTestResult("❌ Please enter a key first.");
      return;
    }

    setTesting(true);
    setTestResult("🔄 Testing connection with Gemini model...");
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${tempKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: "Hello! Respond with exactly the word 'SUCCESS' if you receive this." }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (text.toUpperCase().includes("SUCCESS")) {
        setTestResult("✅ Connection verified! Gemini API key is valid and responding.");
      } else {
        setTestResult(`⚠️ Connected, but response was unexpected: "${text.slice(0, 100)}..."`);
      }
    } catch (error) {
      console.error(error);
      setTestResult(`❌ Connection failed: ${error.message}. Verify the key is correct and has access to Gemini 2.5 Flash.`);
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setTempKey("");
    setApiKey("");
    setTestResult("🧹 Key cleared. Reverted to local rule simulator.");
    setTimeout(() => setTestResult(""), 3000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Developer Settings</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Configure your AI engine connections. By default, Companion uses a localized, high-fidelity mock LLM response simulator.
          </p>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="api-key-input">Gemini API Key</label>
            <input
              type="password"
              className="form-input"
              id="api-key-input"
              placeholder="AIzaSy..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{ fontFamily: "monospace" }}
            />
            <small style={{ color: "var(--text-muted)", display: "block", marginTop: "0.4rem", fontSize: "0.8rem" }}>
              Get a free API key from Google AI Studio. The key is stored in memory and runs securely in your local browser environment.
            </small>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "0.6rem 1.2rem" }}>
              Save API Key
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestConnection}
              disabled={testing || !tempKey}
              style={{ padding: "0.6rem 1.2rem" }}
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleClear}
              style={{ padding: "0.6rem 1.2rem", marginLeft: "auto" }}
            >
              Clear Key
            </button>
          </div>
        </form>

        {testResult && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-color)",
              fontSize: "0.9rem",
              fontWeight: 600,
              animation: "fadeIn 0.2s ease"
            }}
          >
            {testResult}
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Engine Modes</h3>
          <ul style={{ listStylePosition: "inside", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <li>
              <strong>Active Key Mode</strong>: Queries are forwarded directly to the Gemini API client-side, offering full generative responses, summarization, and query execution.
            </li>
            <li>
              <strong>Simulator Mode (No Key)</strong>: Relies on local structured databases mapping complex government instructions, guidelines, templates, and text translators.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
