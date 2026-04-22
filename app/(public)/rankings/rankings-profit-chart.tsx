'use client'

import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

type ChartRow = Record<string, string | number>

const lineColors = [
  '#6ee7b7',
  '#34d399',
  '#2dd4bf',
  '#67e8f9',
  '#a7f3d0',
  '#99f6e4',
  '#5eead4',
  '#86efac',
]

export default function RankingsProfitChart({
  data,
  memberNames,
}: {
  data: ChartRow[]
  memberNames: string[]
}) {
  const [selectedNames, setSelectedNames] = useState<string[]>(memberNames.slice(0, 6))

  const visibleNames = useMemo(() => {
    if (!selectedNames.length) {
      return memberNames.slice(0, 6)
    }
    return selectedNames
  }, [memberNames, selectedNames])

  if (!data.length) {
    return <p className="text-sm text-white/60">グラフに表示するデータがありません。</p>
  }

  const toggleName = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {memberNames.map((name, index) => {
          const active = visibleNames.includes(name)
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleName(name)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                active
                  ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
                  : 'bg-white/5 text-white/55 border border-white/10'
              }`}
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: lineColors[index % lineColors.length] }}
              />
              {name}
            </button>
          )
        })}
      </div>

      <div className="h-[380px] w-full">
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
              formatter={(value, name) => [
                `${Number(value ?? 0).toLocaleString()}pt`,
                String(name ?? ''),
              ]}
              contentStyle={{
                background: '#111715',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            {visibleNames.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}