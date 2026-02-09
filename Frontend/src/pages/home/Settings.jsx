import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link to="/chat" className="text-blue-400 hover:underline">
            Back to chat
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-400">Username</p>
            <p className="text-lg font-semibold">{user?.username || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-lg font-semibold">{user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">User ID</p>
            <p className="text-xs text-slate-300 break-all">{user?._id || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
