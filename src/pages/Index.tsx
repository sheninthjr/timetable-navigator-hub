
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import TimetableHeader from "../components/timetable/TimetableHeader";
import TimetableDisplay from "../components/timetable/TimetableDisplay";
import TimetableLegend from "../components/timetable/TimetableLegend";
import { getTimetable, initializeEmptyTimetable, getSubjects, getStaff, getSettings, saveTimetable } from "../data/dataService";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { generateTimetable } from "../utils/timetableGenerator";
import { toast } from "sonner";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString());
  const [timetable, setTimetable] = useState(getTimetable());

  useEffect(() => {
    // Initialize empty timetable if none exists
    const currentTimetable = getTimetable();
    if (currentTimetable.length === 0) {
      initializeEmptyTimetable();
    }
    setTimetable(getTimetable());
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const handleRegenerateTimetable = () => {
    setIsGenerating(true);
    
    try {
      const subjects = getSubjects();
      const staff = getStaff();
      const settings = getSettings();
      
      if (subjects.length === 0) {
        toast.error("No subjects added. Please add subjects first in the admin panel.");
        setIsGenerating(false);
        return;
      }
      
      if (staff.length === 0) {
        toast.error("No staff added. Please add staff first in the admin panel.");
        setIsGenerating(false);
        return;
      }
      
      console.log("Starting timetable generation...");
      
      // Generate the timetable
      const generatedTimetable = generateTimetable(subjects, staff, settings);
      
      console.log("Timetable generated:", generatedTimetable);
      
      // Save the generated timetable
      saveTimetable(generatedTimetable);
      
      // Update the state to force a re-render
      setTimetable(generatedTimetable);
      setLastUpdated(new Date().toLocaleString());
      
      toast.success("Timetable regenerated successfully!");
    } catch (error) {
      console.error("Error generating timetable:", error);
      toast.error("Failed to generate timetable. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <TimetableHeader />
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Weekly Timetable</h2>
            {isAuthenticated && (
              <Button 
                onClick={handleRegenerateTimetable} 
                disabled={isGenerating}
                className="flex gap-2 items-center"
              >
                <RefreshCw className="h-4 w-4" />
                {isGenerating ? "Regenerating..." : "Regenerate Timetable"}
              </Button>
            )}
          </div>
          <TimetableDisplay key={lastUpdated} />
          <TimetableLegend />
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Click on a time slot to edit it (admin access required)</p>
            <p className="mt-1">Last updated: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
