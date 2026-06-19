import React from 'react'

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary-darker)' }}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-muted)' }}>{title}</p>
          <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--color-text-main)' }}>{value}</p>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
