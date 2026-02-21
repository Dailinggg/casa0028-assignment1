import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export function TotalDecadeChart({ rows }) {
  const counts = new Map();
  for (const r of rows) counts.set(r.decade, (counts.get(r.decade) || 0) + 1);

  const decades = Array.from(counts.keys()).sort((a, b) => a - b);
  const labels = decades.map((d) => `${d}s`);
  const values = decades.map((d) => counts.get(d) || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Total plaques (usable year)",
        data: values,
        borderColor: "#111827",
        backgroundColor: "rgba(17, 24, 39, 0.15)",
        pointBackgroundColor: "#111827",
        pointBorderColor: "#111827",
        pointRadius: 3,
        borderWidth: 2,
        tension: 0.25
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div style={{ height: 260 }}>
      <Line data={data} options={options} />
    </div>
  );
}
