import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { Controls } from "./components/Controls";
import { StackedDecadeChart } from "./components/StackedDecadeChart";
import { TotalDecadeChart } from "./components/TotalDecadeChart";
import { RoleTable } from "./components/RoleTable";
import { PlaqueList } from "./components/PlaqueList";
import { toYear, decadeOf, normaliseRole } from "./lib/clean";

function Card({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02)"
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [raw, setRaw] = useState([]);
  const [error, setError] = useState("");

  const [yearRange, setYearRange] = useState({ min: 1870, max: 2020 });
  const [mode, setMode] = useState("count");
  const [focusRole, setFocusRole] = useState("All");
  const [hideUnknown, setHideUnknown] = useState(false);
  const [topN, setTopN] = useState(8);

  useEffect(() => {
    fetch("/plaques_london.csv")
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        setRaw(parsed.data);
      })
      .catch((e) => setError(String(e)));
  }, []);

  // keep more fields for "observations"
  const cleaned = useMemo(() => {
    return raw
      .map((r) => {
        const year = toYear(r.erected);
        if (year === null) return null;

        const role = normaliseRole(r.lead_subject_primary_role, r.lead_subject_type);

        return {
          id: r.id,
          year,
          decade: decadeOf(year),
          role,
          title: r.title || "",
          address: r.address || ""
        };
      })
      .filter(Boolean);
  }, [raw]);

  const filtered = useMemo(() => {
    return cleaned.filter((d) => {
      const inYear = d.year >= yearRange.min && d.year <= yearRange.max;
      const okRole = hideUnknown ? d.role !== "Unknown" : true;
      return inYear && okRole;
    });
  }, [cleaned, yearRange, hideUnknown]);

  const focusOptions = useMemo(() => {
    if (!filtered.length) return ["Others"];
    const counts = new Map();
    for (const r of filtered) counts.set(r.role, (counts.get(r.role) || 0) + 1);
    const top = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([k]) => k);
    return [...top, "Others"];
  }, [filtered, topN]);

  useEffect(() => {
    if (focusRole === "All") return;
    if (!focusOptions.includes(focusRole)) setFocusRole("All");
  }, [focusOptions, focusRole]);

  const insight = useMemo(() => {
    if (!filtered.length) return "No plaques with a usable year in this range.";

    const overall = new Map();
    for (const r of filtered) overall.set(r.role, (overall.get(r.role) || 0) + 1);
    const [topRole, topCount] = Array.from(overall.entries()).sort((a, b) => b[1] - a[1])[0];
    const overallShare = ((topCount / filtered.length) * 100).toFixed(1);

    const byDecade = new Map();
    for (const r of filtered) {
      if (!byDecade.has(r.decade)) byDecade.set(r.decade, new Map());
      const m = byDecade.get(r.decade);
      m.set(r.role, (m.get(r.role) || 0) + 1);
    }

    let best = null;
    for (const [decade, m] of byDecade.entries()) {
      let total = 0;
      for (const x of m.values()) total += x;
      const [r0, c0] = Array.from(m.entries()).sort((a, b) => b[1] - a[1])[0];
      const s0 = total > 0 ? c0 / total : 0;
      if (!best || s0 > best.share) best = { decade, role: r0, share: s0 };
    }

    return `Overall (${yearRange.min}–${yearRange.max}), “${topRole}” is most common (${overallShare}%). The strongest decade-level dominance is the ${best.decade}s, where “${best.role}” reaches ${(best.share * 100).toFixed(1)}%.`;
  }, [filtered, yearRange]);

  const missingYearPct = useMemo(() => {
    if (!raw.length) return "0.0";
    return ((1 - cleaned.length / raw.length) * 100).toFixed(1);
  }, [raw, cleaned]);

  const pickRole = (role) => {
    setFocusRole(role);
    setMode("share"); // 点击 role 时自动切 share
  };

  const pickPlaque = (p) => {
    // 跳到该 plaque 的 decade
    setYearRange({ min: p.decade, max: p.decade + 9 });
    setFocusRole(p.role);
    setMode("share");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 1600, margin: "0 auto" }}>
          <header style={{ marginBottom: 14 }}>
            <h1 style={{ margin: 0, fontSize: 44, letterSpacing: "-0.02em", color: "#111827" }}>
              London Blue Plaques Explorer
            </h1>
            <p style={{ margin: "8px 0 0", color: "#4b5563", fontSize: 16 }}>
              Explore how commemorated roles shift over time—and test whether patterns survive missing/unknown metadata.
            </p>
          </header>

          {error ? (
            <Card>
              <p style={{ color: "crimson", margin: 0 }}>{error}</p>
            </Card>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 16,
                alignItems: "start",
                gridTemplateColumns: "minmax(320px, 420px) minmax(640px, 1fr)"
              }}
            >
              {/* LEFT */}
              <div style={{ display: "grid", gap: 12 }}>
                <Card>
                  <Controls
                    yearRange={yearRange}
                    setYearRange={setYearRange}
                    mode={mode}
                    setMode={setMode}
                    focusRole={focusRole}
                    setFocusRole={setFocusRole}
                    roles={focusOptions}
                    hideUnknown={hideUnknown}
                    setHideUnknown={setHideUnknown}
                    topN={topN}
                    setTopN={setTopN}
                  />
                </Card>

                <Card>
                  <div style={{ fontSize: 18 }}>
                    <strong>{filtered.length}</strong> plaques in view
                  </div>

                  <div style={{ marginTop: 8, color: "#374151", lineHeight: 1.5 }}>{insight}</div>

                  <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
                    How to explore:
                    This page compares how commemorated roles change across decades. I keep both Count and Share because the 2010s look extreme in counts, but much calmer in composition. The Unknown toggle is a quick robustness check. In my case the charts do not change much when I hide Unknown, so the main pattern does not seem driven by missing labels.
Top roles controls how much detail is shown. Moving from 5 to 8 reduces Others clearly, while 8 to 12 only changes the chart slightly. That tells me the extra categories after 8 are small, so Top roles mainly affects readability rather than the main story.
                  </div>

                  <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
                    Note: {missingYearPct}% of records in the source CSV have missing/invalid year and are excluded.
                  </div>

                  <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
                    Data: Open Plaques (London CSV). Charts: Chart.js via react-chartjs-2.
                  </div>
                </Card>

                <Card>
                  <RoleTable rows={filtered} topN={topN} onPickRole={pickRole} />
                </Card>

                <Card>
                  <PlaqueList rows={filtered} onPickPlaque={pickPlaque} sampleSize={18} />
                </Card>
              </div>

              {/* RIGHT */}
              <div style={{ display: "grid", gap: 12, minWidth: 640 }}>
                <Card>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: "#111827" }}>
                    Volume over time
                  </div>
                  <TotalDecadeChart rows={filtered} />
                </Card>

                <Card>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: "#111827" }}>
                    Composition by decade ({mode === "share" ? "share" : "count"})
                  </div>
                  <StackedDecadeChart rows={filtered} mode={mode} focusRole={focusRole} topN={topN} />
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
