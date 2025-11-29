import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            TS
          </div>
          <div>
            <div className="font-semibold">TeekaSarthi</div>
            <div className="text-xs text-gray-500">Supervisor Module</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">{user?.name || 'Supervisor'}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
