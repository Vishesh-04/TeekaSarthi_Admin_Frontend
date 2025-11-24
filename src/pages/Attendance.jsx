import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import Loader from '../components/Loader'
import { toCSV } from '../utils/formatters'
import { saveAs } from 'file-saver'

export default function Attendance() {
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState([])

  useEffect(()=> {
    async function load() {
      setLoading(true)
      try {
        const res = await axiosClient.get(
          `/api/supervisor/attendance/${
            localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user")).id
              : ""
          }`
        );
        setAttendance(res.data || [])
      } catch (err) {
        setAttendance([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function exportCSV() {
    const csv = toCSV(attendance, ['date','status','type'])
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'attendance.csv')
  }

  if (loading) return <Loader className="h-32" />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Attendance - This Month</h2>
        <button onClick={exportCSV} className="px-3 py-1 bg-primary text-white rounded">Export CSV</button>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="grid grid-cols-7 gap-2">
          {(attendance || []).map((d) => (
            <div key={d.date} className={`p-3 rounded ${d.type==='auto' ? 'bg-green-50' : d.type==='manual' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <div className="font-semibold">{d.date}</div>
              <div className="text-sm text-gray-600">{d.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
