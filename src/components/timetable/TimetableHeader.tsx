
import React from "react";
import { getSettings } from "../../data/dataService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const TimetableHeader = () => {
  const settings = getSettings();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            {settings.classDetails.institution}
          </h2>
          <p className="text-gray-600">
            {settings.classDetails.department}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-medium text-gray-800">Class Details</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="text-gray-600">Year:</span>{" "}
                <span className="font-medium">{settings.classDetails.year}</span>
              </li>
              <li>
                <span className="text-gray-600">Semester:</span>{" "}
                <span className="font-medium">{settings.classDetails.semester}</span>
              </li>
              <li>
                <span className="text-gray-600">Branch:</span>{" "}
                <span className="font-medium">{settings.classDetails.branch}</span>
              </li>
              <li>
                <span className="text-gray-600">Section:</span>{" "}
                <span className="font-medium">{settings.classDetails.section}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800">Academic Year</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="text-gray-600">Term:</span>{" "}
                <span className="font-medium">{settings.classDetails.academicYear}</span>
              </li>
              <li>
                <span className="text-gray-600">Effective From:</span>{" "}
                <span className="font-medium">{settings.classDetails.effectiveFrom}</span>
              </li>
            </ul>
            
            {isAuthenticated && (
              <div className="mt-4">
                <Button onClick={() => navigate("/admin")}>
                  Manage Timetable
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableHeader;
