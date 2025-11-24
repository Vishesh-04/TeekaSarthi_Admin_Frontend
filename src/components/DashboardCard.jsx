import React from 'react'

export default function DashboardCard({ title, value, color = 'bg-primary', icon }) {
  return (
    <div className="p-4 rounded-2xl shadow-sm bg-white flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
        {icon || title[0]}
      </div>
    </div>
  )
}
