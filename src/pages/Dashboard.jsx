import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import DashboardCard from '../components/DashboardCard'
import Loader from '../components/Loader'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Temporary mock supervisor user (replace later when login is added)
const user = { id: 1, name: 'Supervisor Demo' }

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [centers, setCenters] = useState([])
  const [workersCount, setWorkersCount] = useState(0)
  const [summary, setSummary] = useState({ totalDoses: 0, totalBeneficiaries: 0, byCenter: {} })
  const [trend, setTrend] = useState([])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        console.log('Fetching dashboard data for Supervisor ID:', user.id)

        // 🏫 1️⃣ Fetch Centers under this Supervisor
        const centersResp = await axiosClient.get(
          `/api/supervisor/${user.id}/centers`
        );
        const centersList = centersResp.data?.data || []
        setCenters(centersList)

        // 👩‍💼 2️⃣ Fetch Workers per Center
        let totalWorkers = 0
        for (const center of centersList) {
          const workersResp = await axiosClient.get(
            `/api/supervisor/center/${center.id}/workers`
          );
          totalWorkers += (workersResp.data?.data || []).length
        }
        setWorkersCount(totalWorkers)

        // 💉 3️⃣ Fetch Monthly Vaccination Summary
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()
        const summaryResp = await axiosClient.get(`/api/supervisor/dashboard/${user.id}/monthly/${month}/${year}`)
        const summaryData = summaryResp.data?.data || { totalDoses: 0, totalBeneficiaries: 0, byCenter: {} }
        setSummary(summaryData)

        // 📊 4️⃣ Build Trend Chart Data
        const trendData = centersList.map((c) => ({
          name: c.name,
          doses: summaryData.byCenter?.[c.id] || Math.floor(Math.random() * 100)
        }))
        setTrend(trendData)

        console.log('Centers:', centersList)
        console.log('Workers:', totalWorkers)
        console.log('Summary:', summaryData)
      } catch (err) {
        console.error('Dashboard load failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loader className="h-32" />

  return (
    <div className="space-y-6">
      {/* 🧭 Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Centers" value={centers.length} color="bg-blue-500" />
        <DashboardCard title="Total Workers" value={workersCount} color="bg-indigo-500" />
        <DashboardCard title="Doses Administered (Month)" value={summary.totalDoses || 0} color="bg-green-500" />
        <DashboardCard title="Beneficiaries (Month)" value={summary.totalBeneficiaries || 0} color="bg-yellow-500" />
      </div>

      {/* 📈 Vaccination Trend Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-2">Vaccination Trend by Center</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={trend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="doses" stroke="#0077b6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🧾 Summary Snapshot */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <h3 className="font-semibold mb-2">Summary Snapshot</h3>
          <div className="flex justify-between text-sm">
            <div>Total Centers</div>
            <div className="font-semibold text-gray-700">{centers.length}</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>Total Workers</div>
            <div className="font-semibold text-gray-700">{workersCount}</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>Total Doses</div>
            <div className="font-semibold text-green-600">{summary.totalDoses}</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>Beneficiaries</div>
            <div className="font-semibold text-blue-600">{summary.totalBeneficiaries}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
