export function toYear(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (!s) return null;

  
  const m = s.match(/\d{4}/);
  if (!m) return null;

  const y = Number(m[0]);
  if (!Number.isFinite(y)) return null;
  if (y < 1700 || y > 2035) return null; 
  return y;
}

export function decadeOf(year) {
  return Math.floor(year / 10) * 10;
}

export function normaliseRole(rawPrimaryRole, rawType) {
  const s1 = (rawPrimaryRole ?? "").toString().trim();
  const base = s1 ? s1 : (rawType ?? "Unknown").toString().trim() || "Unknown";

  
  const t = base.toLowerCase();
  if (t.includes("writer") || t.includes("poet") || t.includes("novel")) return "Literature";
  if (t.includes("artist") || t.includes("painter") || t.includes("sculpt")) return "Arts";
  if (t.includes("scient") || t.includes("engineer") || t.includes("mathem")) return "Science/Tech";
  if (t.includes("politic") || t.includes("mp") || t.includes("government")) return "Politics";
  if (t.includes("actor") || t.includes("film") || t.includes("theatre") || t.includes("music")) return "Performance";
  if (t === "man" || t === "woman" || t === "person") return "Unknown";
  if (t.includes("statesman")) return "Politics";
  if (t.includes("activist")) return "Politics";
  if (t.includes("philosoph")) return "Literature";
  if (t.includes("historian")) return "Literature";
  if (t.includes("architect")) return "Arts";
  if (t.includes("designer")) return "Arts";


  return base;
}
