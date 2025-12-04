"use client";

import { useEffect, useRef, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState<number | "">("");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");

  const BACKEND_URL = "http://127.0.0.1:5000/logs";

  const logsRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setLogs("");  // MUST clear old logs
    try {
      const params = new URLSearchParams();

      if (limit !== "") params.append("limit", limit.toString());
      if (level) params.append("level", level);
      if (search) params.append("search", search);

      const res = await fetch(`${BACKEND_URL}?${params.toString()}`);
      const text = await res.text();

      setLogs(text);
    } catch (error) {
      setLogs("⚠️ Unable to load logs from backend.");
    }

    setLoading(false);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const downloadLogs = () => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      level,
      search,
      download: "1",
    });

    window.open(`${BACKEND_URL}?${params.toString()}`, "_blank");
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 text-gray-100">
      <div className="max-w-4xl mx-auto bg-[#1e293b] rounded-xl shadow-xl p-6 border border-gray-700">

        <header className="flex justify-between items-center pb-4 mb-4 border-b border-gray-600">
          <h1 className="text-2xl font-bold text-blue-400">📜 System Logs</h1>

          <button
            onClick={fetchLogs}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Refresh
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Limit</label>
            <input
              type="number"
              value={limit}
              placeholder="e.g., 100"
              onChange={(e) =>
                setLimit(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="bg-[#0f172a] border border-gray-600 rounded p-2 text-gray-100 w-32"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-[#0f172a] border border-gray-600 rounded p-2 text-gray-100"
            >
              <option value="">All</option>
              <option value="INFO">INFO</option>
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
            </select>
          </div>

          <div className="flex flex-col flex-grow">
            <label className="text-sm text-gray-300 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0f172a] border border-gray-600 rounded p-2 text-gray-100 w-full"
            />
          </div>

          <button
            onClick={downloadLogs}
            className="self-end bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
          >
            Download Logs
          </button>
        </div>

        {/* Logs Output */}
        <div
          ref={logsRef}
          className="bg-[#0f172a] border border-gray-700 p-4 rounded-lg h-[65vh] overflow-y-auto hide-scrollbar text-sm"
        >
          <pre className="whitespace-pre-wrap">
            {loading ? "Loading logs..." : logs}
          </pre>
        </div>

      </div>
    </main>
  );
}
