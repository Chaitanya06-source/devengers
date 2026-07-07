import React, { useState } from "react";

export default function IssueReporter() {
  const [issues, setIssues] = useState([
    {
      id: "REP-4091",
      title: "Deep Pothole",
      category: "Infrastructure",
      location: "Downtown (5th & Broadway)",
      description: "Severe pothole causing vehicles to swerve dangerously into the adjacent lane.",
      status: "Assigned",
      date: "2026-07-06",
      timeline: [
        { status: "Submitted", date: "2026-07-06 09:12 AM", completed: true },
        { status: "Under Review", date: "2026-07-06 02:45 PM", completed: true },
        { status: "Assigned", date: "2026-07-07 08:30 AM", completed: true },
        { status: "Resolved", date: "", completed: false }
      ]
    },
    {
      id: "REP-3904",
      title: "Broken Streetlight",
      category: "Utilities",
      location: "North End (Library Parking)",
      description: "Streetlight has been flickering and is now completely out, causing dark walking paths.",
      status: "Resolved",
      date: "2026-07-04",
      timeline: [
        { status: "Submitted", date: "2026-07-04 11:20 PM", completed: true },
        { status: "Under Review", date: "2026-07-05 09:00 AM", completed: true },
        { status: "Assigned", date: "2026-07-05 10:15 AM", completed: true },
        { status: "Resolved", date: "2026-07-06 04:10 PM", completed: true }
      ]
    }
  ]);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Infrastructure");
  const [formDescription, setFormDescription] = useState("");
  const [selectedMapGrid, setSelectedMapGrid] = useState("Downtown");
  const [attachedImage, setAttachedImage] = useState(null);
  const [scanningImage, setScanningImage] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const mapNeighborhoods = ["Downtown", "Westside", "North End", "Waterfront", "East Heights", "South Hills"];

  const handleImageSimulation = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachedImage(file.name);
    setScanningImage(true);
    setAiSuggestion("");

    // Simulate AI image analysis
    setTimeout(() => {
      setScanningImage(false);
      // Auto-suggest category based on keywords in filename or default suggestions
      const fname = file.name.toLowerCase();
      if (fname.includes("pothole") || fname.includes("road") || fname.includes("crack")) {
        setFormCategory("Infrastructure");
        setAiSuggestion("🤖 AI Suggestion: Detected Infrastructure Issue (Road Crack/Pothole)");
      } else if (fname.includes("light") || fname.includes("wire") || fname.includes("leak")) {
        setFormCategory("Utilities");
        setAiSuggestion("🤖 AI Suggestion: Detected Utility Issue (Water/Power)");
      } else if (fname.includes("trash") || fname.includes("garbage") || fname.includes("litter")) {
        setFormCategory("Sanitation");
        setAiSuggestion("🤖 AI Suggestion: Detected Sanitation Issue (Waste/Trash)");
      } else {
        setAiSuggestion("🤖 AI Scan: Image uploaded. Verified clear detail.");
      }
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const newIssue = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formTitle,
      category: formCategory,
      location: `${selectedMapGrid} (User selected on map)`,
      description: formDescription,
      status: "Submitted",
      date: new Date().toISOString().split('T')[0],
      timeline: [
        { status: "Submitted", date: new Date().toLocaleString(), completed: true },
        { status: "Under Review", date: "", completed: false },
        { status: "Assigned", date: "", completed: false },
        { status: "Resolved", date: "", completed: false }
      ]
    };

    setIssues(prev => [newIssue, ...prev]);

    // Reset Form
    setFormTitle("");
    setFormDescription("");
    setAttachedImage(null);
    setAiSuggestion("");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Submitted":
        return { backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" };
      case "Under Review":
        return { backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" };
      case "Assigned":
        return { backgroundColor: "rgba(139, 92, 246, 0.15)", color: "#c084fc" };
      case "Resolved":
        return { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399" };
      default:
        return {};
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Issue Reporter & Tracker</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Report infrastructure damages, utility disruptions, or sanitation concerns, and track real-time resolution status.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
        
        {/* Report Form */}
        <div className="card">
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📢</span> File a New Civic Complaint
          </h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Issue Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Water Leakage, Blocked Drain, Pothole"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                <option value="Infrastructure">Infrastructure (Roads, Bridges, Sidewalks)</option>
                <option value="Utilities">Utilities (Water leaks, Flickering Power, Gas)</option>
                <option value="Sanitation">Sanitation (Waste Dumping, Trash Overflow)</option>
                <option value="Public Safety">Public Safety (Hazardous trees, Blocked crossings)</option>
                <option value="Accessibility">Accessibility (Damaged ramp, Inoperative lift)</option>
              </select>
            </div>

            {/* Interactive City Grid Map Selector */}
            <div className="form-group">
              <label className="form-label">Select Location (Interactive Neighborhood Map)</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                  background: "var(--bg-input)",
                  padding: "0.5rem",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)"
                }}
              >
                {mapNeighborhoods.map((n) => {
                  const isSelected = selectedMapGrid === n;
                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setSelectedMapGrid(n)}
                      style={{
                        padding: "0.75rem 0.5rem",
                        fontSize: "0.8rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                        backgroundColor: isSelected ? "var(--accent-primary)" : "var(--bg-secondary)",
                        color: isSelected ? "white" : "var(--text-secondary)",
                        border: isSelected ? "1px solid var(--accent-secondary)" : "1px solid var(--border-color)",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      📍 {n}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Please describe the issue, specific landmarks, and context..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
              />
            </div>

            {/* Image Upload Simulator */}
            <div className="form-group">
              <label className="form-label">Upload Evidence Photo</label>
              <div
                style={{
                  border: "2px dashed var(--border-color)",
                  borderRadius: "10px",
                  padding: "1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: attachedImage ? "rgba(59, 130, 246, 0.04)" : "transparent"
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSimulation}
                  style={{ display: "none" }}
                  id="evidence-file"
                />
                <label htmlFor="evidence-file" style={{ cursor: "pointer", display: "block" }}>
                  <span style={{ fontSize: "1.5rem" }}>📷</span>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    {attachedImage ? `Selected: ${attachedImage}` : "Click to select or drop image"}
                  </p>
                </label>
              </div>

              {scanningImage && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-secondary)", display: "flex", gap: "6px", alignItems: "center" }}>
                  <span className="spinner-sim" style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid var(--accent-secondary)", borderTop: "2px solid transparent", animation: "floatPulse 1s infinite" }}></span>
                  Analyzing image features using Computer Vision AI...
                </div>
              )}

              {aiSuggestion && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.8rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "6px",
                    backgroundColor: "rgba(139, 92, 246, 0.12)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    border: "1px solid rgba(139, 92, 246, 0.3)"
                  }}
                >
                  {aiSuggestion}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Submit Incident Report
            </button>
          </form>
        </div>

        {/* Tracker Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="card" style={{ paddingBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🔍</span> Status Tracker
            </h3>

            {/* List of complaints */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "65vh", overflowY: "auto" }}>
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="card"
                  style={{
                    margin: 0,
                    padding: "1.25rem",
                    backgroundColor: "var(--bg-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>{issue.id}</span>
                      <h4 style={{ fontSize: "1.1rem", margin: "0.15rem 0" }}>{issue.title}</h4>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                        <span style={{ fontSize: "0.7rem", backgroundColor: "var(--bg-input)", color: "var(--text-secondary)", padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
                          📁 {issue.category}
                        </span>
                        <span style={{ fontSize: "0.7rem", backgroundColor: "var(--bg-input)", color: "var(--text-secondary)", padding: "0.15rem 0.5rem", borderRadius: "10px" }}>
                          📍 {issue.location}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "12px",
                        ...getStatusStyle(issue.status)
                      }}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {issue.description}
                  </p>

                  {/* Tracking Timeline Visualizer */}
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                      {/* Horizontal track line */}
                      <div style={{ position: "absolute", left: "5%", right: "5%", top: "8px", height: "2px", background: "var(--border-color)", zIndex: 1 }}></div>

                      {issue.timeline.map((step, idx) => (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: "22%" }}>
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              backgroundColor: step.completed ? "var(--success)" : "var(--bg-input)",
                              border: `2px solid ${step.completed ? "var(--success)" : "var(--border-color)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.55rem"
                            }}
                          >
                            {step.completed && "✓"}
                          </div>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, marginTop: "0.25rem", textAlign: "center", color: step.completed ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {step.status}
                          </span>
                          {step.date && (
                            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textAlign: "center" }}>
                              {step.date.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
