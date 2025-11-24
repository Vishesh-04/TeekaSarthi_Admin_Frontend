import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

export default function WorkerDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // endpoint outside supervisor base (per prompt)
        const res = await axios.get(`/api/worker/${id}/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSummary(res.data);
      } catch (err) {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Loader className="h-32" />;
  if (!summary) return <div>No worker data.</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">{summary.name}</h3>
        <div className="text-sm text-gray-600">
          Attendance: {summary.attendancePercent}%
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow">
        <h4 className="font-semibold mb-2">Recent Sessions</h4>
        <ul className="space-y-2">
          {(summary.recentSessions || []).map((s) => (
            <li key={s.id} className="p-2 border rounded">
              <div className="font-semibold">{s.vaccine}</div>
              <div className="text-sm text-gray-500">{s.date}</div>
              <div className="text-sm">{s.count} beneficiaries</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
