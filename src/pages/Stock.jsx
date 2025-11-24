import React, { useEffect, useState } from 'react'
import axiosClient from '../api/axiosClient'
import DataTable from '../components/DataTable'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import mockUser from '../mock/mockUser'

export default function Stock() {
  const [loading, setLoading] = useState(true)
  const [centers, setCenters] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const supervisorId = mockUser.id // since no auth implemented yet

  useEffect(() => {
    async function loadCenters() {
      setLoading(true)
      try {
        const res = await axiosClient.get(
          `api/supervisor/${supervisorId}/centers`
        );
        const centersList = res.data?.data || []
        setCenters(centersList)
        setError(null)
      } catch (err) {
        console.error('Failed to load centers:', err)
        setCenters([])
        setError('Failed to load centers. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    loadCenters()
  }, [supervisorId])

  if (loading) return <Loader className="h-32" />

  const cols = [
    { key: 'name', title: 'Center Name' },
    { key: 'code', title: 'Code' },
    { key: 'address', title: 'Address' },
    {
      key: 'workerCount',
      title: 'Workers',
      render: (v, row) => row.workers?.length ?? 0
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Centers Under Supervisor</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
        >
          ← Back to Dashboard
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : (
        <DataTable
          columns={cols}
          data={centers}
          actions={(row) => (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/stock/${row.id}`)}
                className="text-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                View Details
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
}
