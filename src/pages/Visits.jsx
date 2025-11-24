import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function Visits() {
  const [loading, setLoading] = useState(true)
  const [visits, setVisits] = useState([])

  useEffect(()=> {
    async function load() {
      setLoading(true)
      try {
        const res = await axiosClient.get("/api/supervisor/visits/today");
        setVisits(res.data || [])
      } catch (err) {
        setVisits([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function verify(visitId) {
    toast.success('Verified (placeholder)')
  }
  function flag(visitId) {
    toast.error('Flagged (placeholder)')
  }

  if (loading) return <Loader className="h-32" />

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Visits - Today</h2>

      <div className="bg-white p-4 rounded-2xl shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Beneficiary</th>
              <th className="px-4 py-2 text-left">Address / Location</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map(v=>(
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.beneficiaryName || 'Unknown'}</td>
                <td className="px-4 py-2">
                  <div>{v.address || '-'}</div>
                  {(v.lat || v.lng) && (
                    <div className="text-xs text-gray-500">Lat: {v.lat ?? '-'}, Lng: {v.lng ?? '-'}</div>
                  )}
                </td>
                <td className="px-4 py-2">
                  {v.verified ? <span className="text-green-700">Verified</span> : v.flagged ? <span className="text-red-700">Flagged</span> : <span className="text-gray-600">Pending</span>}
                </td>
                <td className="px-4 py-2">
                  <button onClick={()=>verify(v.id)} className="mr-2 px-3 py-1 bg-green-100 rounded text-green-700">Verify</button>
                  <button onClick={()=>flag(v.id)} className="px-3 py-1 bg-red-100 rounded text-red-700">Flag</button>
                </td>
              </tr>
            ))}
            {visits.length===0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400">No visits</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
