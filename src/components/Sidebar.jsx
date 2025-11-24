import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiMapPin, FiUsers, FiFileText, FiActivity, FiPackage } from 'react-icons/fi'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/centers', label: 'Centers', icon: <FiUsers /> },
  { to: '/sessions', label: 'Sessions', icon: <FiActivity /> },
  // { to: '/visits', label: 'Visits', icon: <FiMapPin /> },
  // { to: '/attendance', label: 'Attendance', icon: <FiFileText /> },
  { to: '/stock', label: 'Stock', icon: <FiPackage /> },
  // { to: '/reports', label: 'Reports', icon: <FiFileText /> }
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <nav className="p-4 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 ${isActive ? 'bg-gray-100 font-semibold' : 'text-gray-700'}`
            }
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
