import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffManager from "./StaffManager";
import SubjectManager from "./SubjectManager";
import TimetableGenerator from "./TimetableGenerator";
import ClassDetailsForm from "./ClassDetailsForm";
import { Staff, Subject, TimetableSettings } from "@/types/timetable";

interface AdminTabsProps {
  initialStaff?: Staff[];
  initialSubjects?: Subject[];
  initialSettings?: TimetableSettings;
}

const AdminTabs = ({ initialStaff, initialSubjects, initialSettings }: AdminTabsProps) => {
  const [activeTab, setActiveTab] = useState("class-details");

  return (
    <Tabs defaultValue="class-details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="class-details">Class Details</TabsTrigger>
        <TabsTrigger value="staff">Staff Management</TabsTrigger>
        <TabsTrigger value="subjects">Subject Management</TabsTrigger>
        <TabsTrigger value="generate">Generate Timetable</TabsTrigger>
      </TabsList>

      <TabsContent value="class-details">
        <ClassDetailsForm 
          initialSettings={initialSettings}
          onComplete={() => setActiveTab("staff")} 
        />
      </TabsContent>
      
      <TabsContent value="staff">
        <StaffManager 
          initialStaff={initialStaff}
          onComplete={() => setActiveTab("subjects")} 
        />
      </TabsContent>
      
      <TabsContent value="subjects">
        <SubjectManager 
          initialSubjects={initialSubjects}
          onComplete={() => setActiveTab("generate")} 
        />
      </TabsContent>
      
      <TabsContent value="generate">
        <TimetableGenerator />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
