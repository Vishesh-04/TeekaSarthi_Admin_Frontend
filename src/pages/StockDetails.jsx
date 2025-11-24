import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";

export default function StockDetails() {
  const { id } = useParams(); // This is the center_id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  const [stock, setStock] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStockDetails() {
      setLoading(true);
      setError(null);

      try {
        // 💉 1. Get Vaccine Stock
        const stockRes = await axiosClient.get(`/api/stock/center/${id}`);
        const rawData = stockRes.data || [];
        const dataWithSerial = rawData.map((item, index) => ({
          ...item,
          serial: index + 1,
        }));
        setStock(dataWithSerial || []);

        // 🏫 2. Get Center Details (to display name/address in header)
        // We fetch the supervisor's list to find this specific center's name
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const supervisorId = user?.id;

        if (supervisorId) {
          const centersRes = await axiosClient.get(
            `/api/supervisor/${supervisorId}/centers`
          );
          const centers = centersRes.data?.data || [];
          const foundCenter = centers.find((c) => String(c.id) === String(id));
          setCenter(foundCenter || { name: "Center", address: "", code: "" });
        } else {
          setCenter({ name: "Center", address: "", code: "" });
        }
      } catch (err) {
        console.error("Error loading stock details:", err);
        setError("Unable to load stock details");
      } finally {
        setLoading(false);
      }
    }

    loadStockDetails();
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

  // 💉 Columns for Vaccine Stock Table
  const stockCols = [
    { key: "serial", title: "No."},
    { key: "name", title: "Vaccine Name" },
    { key: "currentStock", title: "Current Stock" },
    { key: "receivedStock", title: "Received" },
    { key: "usedStock", title: "Used" },
    { key: "expiryDate", title: "Expiry Date" },
    {
      key: "status",
      title: "Status",
      render: (v) => {
        let colorClass = "bg-gray-100 text-gray-700";

        if (v === "AVAILABLE") colorClass = "bg-green-100 text-green-800";
        else if (v === "OUT_OF_STOCK") colorClass = "bg-red-100 text-red-800";
        else if (v === "EXPIRED") colorClass = "bg-yellow-100 text-yellow-800";
        else if (v === "LOW_STOCK")
          colorClass = "bg-orange-100 text-orange-800";

        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
          >
            {v}
          </span>
        );
      },
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
          ← Back to Dashboard
        </button>
      </div>

      {/* 💉 Vaccine Stock Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            💉 Vaccine Inventory
          </h3>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border">
            Total Items: {stock.length}
          </span>
        </div>

        <DataTable columns={stockCols} data={stock} />
      </div>
    </div>
  );
}
