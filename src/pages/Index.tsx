
import React, { useEffect } from "react";
import Header from "../components/Header";
import TimetableHeader from "../components/timetable/TimetableHeader";
import TimetableDisplay from "../components/timetable/TimetableDisplay";
import TimetableLegend from "../components/timetable/TimetableLegend";
import { getTimetable, initializeEmptyTimetable } from "../data/dataService";

const Index = () => {
  useEffect(() => {
    // Initialize empty timetable if none exists
    const currentTimetable = getTimetable();
    if (currentTimetable.length === 0) {
      initializeEmptyTimetable();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <TimetableHeader />
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-4">Weekly Timetable</h2>
          <TimetableDisplay />
          <TimetableLegend />
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Click on a time slot to edit it (admin access required)</p>
            <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
