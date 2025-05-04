import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const email = localStorage.getItem("googleEmail") || localStorage.getItem("manualEmail");

  return email ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
