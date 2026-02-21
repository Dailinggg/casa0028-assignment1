import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const PALETTE = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#17becf", "#bcbd22", "#7f7f7f",
  "#393b79", "#637939", "#8c6d31", "#843c39", "#7b4173"
];

function hashLabel(label) {
  let h = 2166136261;
  for (let i = 0; i < label.length; i++) {
    h ^= label.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function colorFor(label) {
  return PALETTE[hashLabel(label) % PALETTE.length];
}

function withAlpha(hex, a) {
  const x = hex.replace("#", "");
  const r = parseInt(x.slice(0, 2), 16);
  const g = parseInt(x.slice(2, 4), 16);
  const b = parseInt(x.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function buildTopRoles(rows, topN) {
  const counts = new Map();
  for (const r of rows) counts.set(r.role, (counts.get(r.role) || 0) + 1);
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([role]) => role);
}

export function StackedDecadeChart({
  rows,
  mode = "count",
  focusRole = "All",
  topN = 8
}) {
  const byDecade = new Map(); // decade -> Map(role -> count)
  for (const r of rows) {
    if (!byDecade.has(r.decade)) byDecade.set(r.decade, new Map());
    const m = byDecade.get(r.decade);
    m.set(r.role, (m.get(r.role) || 0) + 1);
  }

  const decades = Array.from(byDecade.keys()).sort((a, b) => a - b);
  const labels = decades.map((d) => `${d}s`);

  const topRoles = buildTopRoles(rows, topN);
  const roles = [...topRoles, "Others"];

  const datasets = roles.map((role) => {
    const values = decades.map((d) => {
      const m = byDecade.get(d);

      let v = 0;
      if (role === "Others") {
        for (const [k, c] of m.entries()) {
          if (!topRoles.includes(k)) v += c;
        }
      } else {
        v = m.get(role) || 0;
      }

      if (mode === "count") return v;

      let total = 0;
      for (const x of m.values()) total += x;
      return total > 0 ? v / total : 0;
    });

    const isFocus =
      focusRole === "All" || focusRole === role || (role === "Others" && focusRole === "Others");

    const base = colorFor(role);

    
    return {
      label: role,
      data: values,
      backgroundColor: isFocus ? withAlpha(base, 0.85) : withAlpha(base, 0.35),
      borderColor: isFocus ? base : withAlpha(base, 0.55),
      borderWidth: isFocus ? 2 : 1
    };
  });

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 14, boxHeight: 14 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.raw;
            if (mode === "share") return `${ctx.dataset.label}: ${(v * 100).toFixed(1)}%`;
            return `${ctx.dataset.label}: ${v}`;
          }
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        suggestedMax: mode === "share" ? 1 : undefined,
        ticks: { callback: (v) => (mode === "share" ? `${Math.round(v * 100)}%` : v) }
      }
    }
  };

  return (
    <div style={{ height: 460 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
