'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type ChartRow = {
  label: string
  profit: number
  cumulative: number
}

export default function ProfitChart({ data }: { data: ChartRow[] }) {
  if (!data.length) {
    return <p className="text-sm text-white/60">グラフに表示するデータがありません。</p>
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          />
          <YAxis
            tickFormatter={(value) => `${Number(value ?? 0).toLocaleString()}pt`}
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
          />
          <Tooltip
            formatter={(value) => `${Number(value ?? 0).toLocaleString()}pt`}
            contentStyle={{
              background: '#111715',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#34d399"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}