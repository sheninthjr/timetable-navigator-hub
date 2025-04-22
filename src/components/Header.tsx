
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Timetable Navigator Hub</h1>
          <p className="text-sm opacity-80">Velammal Institute of Technology</p>
        </div>
        
        <nav className="flex gap-4 items-center">
          <Link 
            to="/" 
            className={`hover:underline ${location.pathname === "/" ? "font-bold" : ""}`}
          >
            View Timetable
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/admin" 
                className={`hover:underline ${location.pathname.startsWith("/admin") ? "font-bold" : ""}`}
              >
                Admin Panel
              </Link>
              <Button 
                onClick={logout}
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link 
              to="/login" 
              className={`hover:underline ${location.pathname === "/login" ? "font-bold" : ""}`}
            >
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
