export function Controls({
  yearRange,
  setYearRange,
  mode,
  setMode,
  focusRole,
  setFocusRole,
  roles,
  hideUnknown,
  setHideUnknown,
  topN,
  setTopN
}) {
  const updateMin = (e) => {
    const nextMin = Number(e.target.value);
    setYearRange((r) => ({ min: Math.min(nextMin, r.max), max: r.max }));
  };

  const updateMax = (e) => {
    const nextMax = Number(e.target.value);
    setYearRange((r) => ({ min: r.min, max: Math.max(nextMax, r.min) }));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center" }}>
        <label>From</label>
        <input type="number" value={yearRange.min} onChange={updateMin} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center" }}>
        <label>To</label>
        <input type="number" value={yearRange.max} onChange={updateMax} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center" }}>
        <label>Mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="count">Count</option>
          <option value="share">Share</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10, alignItems: "center" }}>
        <label>Focus</label>
        <select value={focusRole} onChange={(e) => setFocusRole(e.target.value)}>
          <option value="All">All</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          id="hideUnknown"
          type="checkbox"
          checked={hideUnknown}
          onChange={(e) => setHideUnknown(e.target.checked)}
        />
        <label htmlFor="hideUnknown">Hide “Unknown”</label>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ fontSize: 13, color: "#374151" }}>Top roles</label>
          <span style={{ fontSize: 13, color: "#374151" }}><strong>{topN}</strong></span>
        </div>
        <input
          type="range"
          min="5"
          max="12"
          step="1"
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
          Controls how many roles are shown explicitly; the rest are grouped as “Others”.
        </div>
      </div>
    </div>
  );
}
