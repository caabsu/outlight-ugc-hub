"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, Tooltip } from "recharts";

type ChartPoint = {
  label: string;
  spend: number;
  revenue: number;
};

export const PerformanceChart = ({ data }: { data: ChartPoint[] }) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="label" stroke="#94a3b8" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#0f172a"
          fillOpacity={1}
          fill="url(#colorSpend)"
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#22d3ee"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
