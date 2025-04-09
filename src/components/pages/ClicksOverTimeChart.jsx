import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ClicksOverTimeChart({ analytics = [] }) {
  const groupedData = analytics.reduce((acc, a) => {
    const date = new Date(a.timestamp).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([date, clicks]) => ({
    date,
    clicks,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3 className="font-semibold mb-3">Clicks Over Time</h3>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
