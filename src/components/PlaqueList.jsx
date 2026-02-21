import { useMemo, useState } from "react";

function sampleRows(rows, n) {
  if (rows.length <= n) return rows;
  const picked = [];
  const used = new Set();
  while (picked.length < n && used.size < rows.length) {
    const i = Math.floor(Math.random() * rows.length);
    if (used.has(i)) continue;
    used.add(i);
    picked.push(rows[i]);
  }
  return picked;
}

export function PlaqueList({ rows, onPickPlaque, sampleSize = 18 }) {
  const [q, setQ] = useState("");

  
  const sampled = useMemo(() => sampleRows(rows, sampleSize), [rows, sampleSize]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return sampled;
    return sampled.filter((r) => {
      return (
        (r.title && r.title.toLowerCase().includes(s)) ||
        (r.address && r.address.toLowerCase().includes(s)) ||
        (r.role && r.role.toLowerCase().includes(s))
      );
    });
  }, [sampled, q]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontWeight: 600, color: "#111827" }}>Sample plaques</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>click to jump</div>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search in sample…"
        style={{
          width: "100%",
          marginTop: 10,
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          outline: "none"
        }}
      />

      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {shown.map((r) => (
          <button
            key={r.id}
            onClick={() => onPickPlaque(r)}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "10px 10px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff"
            }}
            title="Jump to this plaque's decade & role"
          >
            <div style={{ fontSize: 13, color: "#111827", fontWeight: 600, lineHeight: 1.25 }}>
              {r.title || "Untitled plaque"}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
              {r.decade}s · {r.role} · {r.address || "Address unknown"}
            </div>
          </button>
        ))}
        {!shown.length && (
          <div style={{ fontSize: 12, color: "#6b7280" }}>No matches in this sample.</div>
        )}
      </div>
    </div>
  );
}
