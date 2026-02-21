export function RoleTable({ rows, topN, onPickRole }) {
  // rows: cleaned+filtered records
  const counts = new Map();
  for (const r of rows) counts.set(r.role, (counts.get(r.role) || 0) + 1);

  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, topN);
  const total = rows.length || 1;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontWeight: 600, color: "#111827" }}>Top roles in view</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>click to focus</div>
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {top.map(([role, c]) => {
          const pct = (c / total) * 100;
          return (
            <button
              key={role}
              onClick={() => onPickRole(role)}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "1fr 64px",
                gap: 10,
                alignItems: "center",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff"
              }}
              title="Focus this role"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontSize: 14, color: "#111827" }}>{role}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{c}</div>
                </div>
                <div style={{ marginTop: 6, height: 6, background: "#eef2ff", borderRadius: 999 }}>
                  <div
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      height: "100%",
                      background: "#4f46e5",
                      borderRadius: 999
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>
                {pct.toFixed(1)}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
