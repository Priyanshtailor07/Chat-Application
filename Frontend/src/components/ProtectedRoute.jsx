import React from 'react'
 import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {


const ProtectedRoute = ({ children }) => {
  // Grab auth state from Redux
  const { token, loading } = useSelector((state) => state.auth);

  // 1. MUST handle loading state to prevent premature redirect
  if (loading) return <div className="text-white">Loading session...</div>;

  // 2. Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
}

export default ProtectedRoute