import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function ScheduleDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  // FIX: Explicitly point to the Spring Boot backend port (usually 8080)
  // This prevents the request from hitting the React server (Vite) and returning index.html
  const API_BASE_URL = "http://localhost:8080";

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        console.log(
          `Fetching from: ${API_BASE_URL}/api/supervisor/assignments/worker/${id}/beneficiaries`
        );

        // FIX: Use the full URL here
        const res = await axiosClient.get(
          `/api/supervisor/assignments/worker/${id}/beneficiaries`,
          {
            params: {
              date: selectedDate, // Sends ?date=YYYY-MM-DD
            },
          }
        );

        console.log("Response Data:", res.data);

        // Sanity check: If we still somehow get HTML (string starting with <), throw error
        if (typeof res.data === "string" && res.data.trim().startsWith("<")) {
          throw new Error(
            "Received HTML instead of JSON. Check API URL and Backend Port."
          );
        }

        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Failed to fetch beneficiaries:", err);
        if (err.response) {
          // Server responded with a status code outside 2xx (e.g. 404, 500)
          console.error("Server status:", err.response.status);
          setError(`Server Error: ${err.response.status}`);
        } else if (err.request) {
          // Request was made but no response received (Backend might be down)
          console.error("No response received");
          setError(
            "Network Error: Could not connect to backend (is localhost:8080 running?)"
          );
        } else {
          // Something happened in setting up the request
          setError(err.message);
        }
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "VACCINATED":
        return "bg-green-100 text-green-800";
      case "ABSENT":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="bg-white p-4 rounded-2xl shadow flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Assignment Details
          </h3>
          <p className="text-sm text-gray-500">Worker ID: {id}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-12">
          {/* Inline Spinner (no external import needed) */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : Array.isArray(tasks) && tasks.length > 0 ? (
        <div className="bg-white p-4 rounded-2xl shadow">
          <h4 className="font-semibold mb-4 text-gray-700">
            Beneficiaries List ({tasks.length})
          </h4>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.taskId}
                className="p-3 border border-gray-100 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors"
              >
                <div className="mb-2 sm:mb-0">
                  <div className="font-medium text-gray-900">
                    {task.beneficiaryName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ph: {task.beneficiaryPhone || "N/A"}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      task.taskStatus
                    )}`}
                  >
                    {task.taskStatus}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !error && (
          <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">
              No beneficiaries assigned for {selectedDate}.
            </p>
          </div>
        )
      )}
    </div>
  );
}
