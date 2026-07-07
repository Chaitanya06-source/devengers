import React from "react";

export default function StatsDashboard() {
  const kpis = [
    { title: "Avg Resolution Rate", value: "94.8%", change: "+2.1% this month", trend: "up", color: "var(--success)" },
    { title: "Avg Turnaround Time", value: "1.6 Days", change: "-0.4 days improvement", trend: "up", color: "var(--accent-primary)" },
    { title: "Active Infrastructure Projects", value: "14 Open", change: "4 finishing this week", trend: "neutral", color: "var(--accent-secondary)" },
    { title: "Digital Accessibility Score", value: "98.2%", change: "WCAG 2.1 Compliant", trend: "up", color: "var(--success)" }
  ];

  const categories = [
    { name: "Infrastructure", count: 184, percent: 45, color: "var(--accent-primary)" },
    { name: "Sanitation", count: 92, percent: 22, color: "var(--accent-secondary)" },
    { name: "Utilities", count: 75, percent: 18, color: "var(--success)" },
    { name: "Public Safety", count: 42, percent: 10, color: "var(--warning)" },
    { name: "Accessibility", count: 21, percent: 5, color: "var(--danger)" }
  ];

  const projects = [
    { name: "Main Street Repaving & Cycling Lanes", completion: 78, budget: "$450,000", status: "In Progress" },
    { name: "Library Entrance Accessibility Ramp", completion: 100, budget: "$85,000", status: "Completed" },
    { name: "North-End Smart Solar Streetlighting", completion: 45, budget: "$210,000", status: "In Progress" },
    { name: "Waterfront District Storm Drain Upgrade", completion: 15, budget: "$600,000", status: "Initiated" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Civic Transparency & Analytics</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Real-time metrics on public service delivery, issue resolutions, and ongoing infrastructure budget projects.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card" style={{ margin: 0, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>{kpi.title}</span>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.value}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              📈 {kpi.change}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Issue reports distribution */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3 style={{ fontSize: "1.25rem" }}>Incident Distribution by Category</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            Classification of public issues reported in the last 30 days.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {categories.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{cat.count} reports ({cat.percent}%)</span>
                </div>
                <div style={{ width: "100%", height: "10px", background: "var(--bg-input)", borderRadius: "5px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${cat.percent}%`,
                      height: "100%",
                      backgroundColor: cat.color,
                      borderRadius: "5px"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Infrastructure Capital Projects */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h3 style={{ fontSize: "1.25rem" }}>Ongoing Capital Projects</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            Status of voter-approved municipal development programs.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {projects.map((proj, idx) => (
              <div
                key={idx}
                style={{
                  padding: "1rem",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{proj.name}</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Budget: {proj.budget}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "8px",
                      backgroundColor: proj.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                      color: proj.status === "Completed" ? "#34d399" : "#60a5fa"
                    }}
                  >
                    {proj.status}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                  <div style={{ flexGrow: 1, height: "6px", background: "var(--bg-secondary)", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${proj.completion}%`,
                        height: "100%",
                        background: "linear-gradient(to right, var(--accent-primary), var(--accent-secondary))"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: "bold", minWidth: "30px", textAlign: "right" }}>
                    {proj.completion}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
