
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AdminTabs from "../components/admin/AdminTabs";
import Header from "../components/Header";
import Year from "@/components/admin/Year";

const Admin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Manage staff, subjects, and generate timetables for your institution.
        </p>
        
        <Year />
      </div>
    </div>
  );
};

export default Admin;
