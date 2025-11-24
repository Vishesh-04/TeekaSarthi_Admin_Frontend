import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";

export default function CenterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCenterDetails() {
      setLoading(true);
      setError(null);

      try {
        // 👩‍💼 1. Get workers for this center
        // REMOVED: The hardcoded 'fake-jwt-token' headers. axiosClient handles auth.
        const workersRes = await axiosClient.get(
          `/api/supervisor/center/${id}/workers`
        );

        // Optional: Add serial numbers to workers like we did for stock
        const workersWithSerial = (workersRes.data.data || []).map((w, i) => ({
          ...w,
          serial: i + 1,
        }));
        setWorkers(workersWithSerial);

        // 🏫 2. Get Center Details
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const supervisorId = user.id;

        if (supervisorId) {
          // FIXED: Added '/api/supervisor' to the URL path
          const centersRes = await axiosClient.get(
            `/api/supervisor/${supervisorId}/centers`
          );

          const centers = centersRes.data.data || [];
          const foundCenter = centers.find((id) => String(c.id) === String(id));

          // FIXED: code is now an empty string '' on fail, not an object
          setCenter(foundCenter || { name: "Center", address: "", code: "" });
        } else {
          setCenter({ name: "Center", address: "", code: "" });
        }
      } catch (err) {
        console.error("Error loading center details:", err);
        setError("Unable to load center details");
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    }

    loadCenterDetails();
  }, [id]);

  if (loading) return <Loader className="h-32" />;
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm mt-3 px-3 py-1 bg-gray-100 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );

  // 🧾 Columns
  const cols = [
    { key: "serial", title: "No." }, // Added Serial Number column
    { key: "employeeCode", title: "Employee Code" },
    { key: "name", title: "Worker Name" },
    { key: "phone", title: "Phone" },
    {
      key: "active",
      title: "Status",
      render: (v) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            v ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {v ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 🏫 Header Section */}
      <div className="flex items-center justify-between border-b pb-4 bg-white p-4 rounded shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{center.name}</h2>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition shadow-sm"
        >
          ← Back
        </button>
      </div>

      {/* 👩‍💼 Workers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <DataTable columns={cols} data={workers} />
      </div>
    </div>
  );
}
