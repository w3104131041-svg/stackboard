'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function MyProfitChart({
  data,
}: {
  data: { label: string; value: number }[]
}) {
  if (!data.length) {
    return <p className="text-white/60">データなし</p>
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="label" />
          <YAxis tickFormatter={(v) => `${Number(v).toLocaleString()}pt`} />
          <Tooltip formatter={(v) => `${Number(v).toLocaleString()}pt`} />
          <Line
            dataKey="value"
            stroke="#34d399"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}