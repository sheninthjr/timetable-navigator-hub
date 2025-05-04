import React, { useState } from "react";
import {
  getSubjects,
  getStaff,
  getSettings,
  saveTimetable,
} from "../../data/dataService";
import {
  getSettings as getSettings2,
  getStaff as getStaff2,
  getSubjects as getSubjects2,
} from "@/data/dataService2";
import { generateTimetable } from "../../utils/timetableGenerator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { TimeSlot } from "@/types/timetable";

const TimetableGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    setIsGenerating(true);

    try {
      const subjects = getSubjects();
      const staff = getStaff();
      const settings = getSettings();
      const subjects2 = getSubjects2();
      const staff2 = getStaff2();
      const settings2 = getSettings2();

      if (subjects.length === 0) {
        toast.error("No subjects added. Please add subjects first.");
        setIsGenerating(false);
        return;
      }

      if (staff.length === 0) {
        toast.error("No staff added. Please add staff first.");
        setIsGenerating(false);
        return;
      }

      console.log("Starting timetable generation from admin panel...");
      console.log("Subjects:", subjects);
      console.log("Staff:", staff);

      // Get section from current path
      const pathParts = window.location.pathname.split("/");
      const section = pathParts[pathParts.length - 1]; // 'A' or 'B'

      let generatedTimetable: TimeSlot[] = [];

      if (window.location.pathname.includes("sem3") && section === "B") {
        alert("Generating timetable for sem3 B");
        generatedTimetable = generateTimetable(subjects, staff, settings);
      } else if (window.location.pathname.includes("sem3") && section === "A") {
        generatedTimetable = generateTimetable(subjects2, staff2, settings2);
      } else {
        toast.error("Invalid section in path.");
        setIsGenerating(false);
        return;
      }

      console.log("Timetable generated:", generatedTimetable);

      // Save the generated timetable
      saveTimetable(generatedTimetable);

      toast.success("Timetable generated successfully!");

      // Navigate to the section view
      setTimeout(() => {
        navigate(`/sem3/${section}`);
      }, 1500);
    } catch (error) {
      console.error("Error generating timetable:", error);
      toast.error("Failed to generate timetable. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Timetable</CardTitle>
        <CardDescription>
          Create a timetable based on the staff and subject information you've
          provided
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="font-medium text-yellow-800">Before generating:</h3>
          <ul className="list-disc ml-6 text-yellow-700 mt-2">
            <li>Ensure all staff details are correctly entered</li>
            <li>
              Verify that all subjects have the correct number of periods per
              week
            </li>
            <li>Confirm that labs are properly marked as lab subjects</li>
            <li>Check that all subjects are assigned to staff members</li>
          </ul>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-gray-600">
            Click the button below to generate a timetable according to the
            constraints. The system will automatically assign subjects to time
            slots, ensuring no conflicts.
          </p>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? "Generating..." : "Generate Timetable"}
          </Button>

          <p className="text-sm text-gray-500">
            You can regenerate the timetable any time if you need a different
            arrangement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimetableGenerator;
