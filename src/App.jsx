import React from 'react'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}
