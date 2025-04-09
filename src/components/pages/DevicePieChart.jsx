import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DevicePieChart({ analytics }) {
  const grouped = analytics.reduce((acc, a) => {
    const device = a.device || "unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(grouped).map(([device, count]) => ({
    name: device,
    value: count,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3 className="mt-8 font-semibold">Device Breakdown</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={pieData} outerRadius={80} label>
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
