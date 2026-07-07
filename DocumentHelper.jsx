import React, { useState } from "react";
import { servicesDb } from "../mockData/servicesDb";
import { simplifyText } from "../utils/aiEngine";

const sampleLegalText = `PURSUANT TO SECTION 401(a)(17) OF THE MUNICIPAL URBAN ZONING AND PLANNING ACT OF 1994, AS AMENDED, NOTICE IS HEREBY GIVEN THAT ALL ENTITIES ENGAGED IN COMMERCIAL OR RETAIL COMMERCE WITHIN THE DESIGNATED DEVELOPMENT ZONES (ZONES A THROUGH F) SHALL BE STRICTLY REQUIRED TO PROCURE AND PERPETUALLY DISPLAY A GENERAL BUSINESS LICENSE CERTIFICATE. EXCEPT AS OTHERWISE EXPLICITLY PROVIDED IN SUBSECTION (b) HEREOF, FAILURE TO REGISTER WITHIN THIRTY (30) CALENDAR DAYS OF OPERATION COMMENCEMENT SHALL RENDER THE OPERATING ENTITY LIABLE TO ADMINISTRATIVE PENALTIES NOT EXCEEDING FIVE HUNDRED DOLLARS ($500) PER DIEM. LAND LORDS AND SITE MANAGERS SHALL VERIFY ZONING COMPLIANCE PRIOR TO LEASE EXECUTION.`;

export default function DocumentHelper({ lang, apiKey }) {
  const [selectedServiceId, setSelectedServiceId] = useState(servicesDb[0].id);
  const [checkedDocs, setCheckedDocs] = useState({});
  const [inputText, setInputText] = useState("");
  const [simplifiedOutput, setSimplifiedOutput] = useState("");
  const [isSimplifying, setIsSimplifying] = useState(false);

  const selectedService = servicesDb.find(s => s.id === selectedServiceId);

  // Calculate percentage of documents checkoff
  const docs = selectedService?.documents || [];
  const requiredDocs = docs.filter(d => d.required);
  const totalRequired = requiredDocs.length;
  
  const checkedRequiredCount = requiredDocs.filter(d => checkedDocs[`${selectedServiceId}-${d.name}`]).length;
  const progressPercent = totalRequired > 0 ? Math.round((checkedRequiredCount / totalRequired) * 100) : 100;

  const handleDocCheckChange = (docName) => {
    const key = `${selectedServiceId}-${docName}`;
    setCheckedDocs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSimplifySubmit = async () => {
    if (!inputText.trim()) return;
    setIsSimplifying(true);
    try {
      const simplified = await simplifyText(inputText, lang, apiKey);
      setSimplifiedOutput(simplified);
    } catch (e) {
      console.error(e);
      setSimplifiedOutput("An error occurred during text simplification.");
    } finally {
      setIsSimplifying(false);
    }
  };

  const loadSampleText = () => {
    setInputText(sampleLegalText);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Document Helper & Checker</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Verify your required documents before heading to offices, or translate complex regulatory legalese into plain statements.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem" }}>
        
        {/* Requirement Checker Section */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3 style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📋</span> Document Requirements Checklist
          </h3>

          <div className="form-group">
            <label className="form-label">Select Government Service</label>
            <select
              className="form-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              {servicesDb.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem", fontWeight: 600 }}>
              <span>Required Documents Prepared</span>
              <span style={{ color: progressPercent === 100 ? "var(--success)" : "var(--accent-primary)" }}>
                {progressPercent}% Complete
              </span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "var(--bg-input)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: progressPercent === 100 
                    ? "linear-gradient(to right, var(--success), #34d399)" 
                    : "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))",
                  transition: "width 0.4s ease"
                }}
              />
            </div>
          </div>

          {/* Document list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {docs.map((doc, idx) => {
              const key = `${selectedServiceId}-${doc.name}`;
              const isChecked = !!checkedDocs[key];
              
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    backgroundColor: isChecked ? "rgba(16, 185, 129, 0.08)" : "var(--bg-input)",
                    border: isChecked ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--border-color)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleDocCheckChange(doc.name)}
                    style={{
                      marginTop: "3px",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "var(--success)"
                    }}
                    id={`doc-check-${idx}`}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <label
                      htmlFor={`doc-check-${idx}`}
                      style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        textDecoration: isChecked ? "line-through" : "none",
                        color: isChecked ? "var(--text-secondary)" : "var(--text-primary)"
                      }}
                    >
                      {doc.name}
                    </label>
                    <span
                      style={{
                        marginLeft: "6px",
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "12px",
                        fontWeight: 600,
                        backgroundColor: doc.required ? "rgba(239, 68, 68, 0.15)" : "rgba(107, 114, 128, 0.15)",
                        color: doc.required ? "var(--danger)" : "var(--text-secondary)"
                      }}
                    >
                      {doc.required ? "Required" : "Optional"}
                    </span>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      {doc.description}
                    </p>
                    {doc.tips && (
                      <div style={{ fontSize: "0.75rem", color: "var(--accent-primary)", marginTop: "0.25rem", fontStyle: "italic" }}>
                        💡 Tip: {doc.tips}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal Text Simplifier Section */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3 style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🧠</span> GenAI Rules Simplifier
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            Paste regulatory text or notices below to translate them into plain English.
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Paste complex legalese here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ fontSize: "0.9rem", resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-secondary" onClick={loadSampleText} style={{ flexGrow: 1, padding: "0.6rem" }}>
              Load Sample Notice
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSimplifySubmit}
              disabled={isSimplifying || !inputText.trim()}
              style={{ flexGrow: 2, padding: "0.6rem" }}
            >
              {isSimplifying ? "Simplifying..." : "Simplify with GenAI"}
            </button>
          </div>

          {/* Simplifier Response Area */}
          {simplifiedOutput && (
            <div
              style={{
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                padding: "1.25rem",
                fontSize: "0.9rem",
                animation: "fadeIn 0.3s ease",
                whiteSpace: "pre-line"
              }}
            >
              {simplifiedOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
