import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import Loader from '../components/Loader'

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])

  useEffect(()=> {
    async function load() {
      setLoading(true)
      try {
        const res = await axiosClient.get(
          `/api/supervisor/reports/${
            localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user")).id
              : ""
          }`
        );
        setReports(res.data || [])
      } catch (err) {
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loader className="h-32" />

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <div className="bg-white p-4 rounded-2xl shadow space-y-3">
        {reports.length === 0 && <div className="text-gray-500">No reports available</div>}
        {reports.map((r) => (
          <div key={r.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-gray-500">{r.createdAt}</div>
            </div>
            <div className="flex gap-2">
              {r.file_url && <a href={r.file_url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-primary text-white rounded">Download</a>}
              <button className="px-3 py-1 bg-gray-100 rounded">PDF</button>
              <button className="px-3 py-1 bg-gray-100 rounded">Excel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
