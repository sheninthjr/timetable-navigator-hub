
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffManager from "./StaffManager";
import SubjectManager from "./SubjectManager";
import TimetableGenerator from "./TimetableGenerator";
import ClassDetailsForm from "./ClassDetailsForm";

const AdminTabs = () => {
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
        <ClassDetailsForm onComplete={() => setActiveTab("staff")} />
      </TabsContent>
      
      <TabsContent value="staff">
        <StaffManager onComplete={() => setActiveTab("subjects")} />
      </TabsContent>
      
      <TabsContent value="subjects">
        <SubjectManager onComplete={() => setActiveTab("generate")} />
      </TabsContent>
      
      <TabsContent value="generate">
        <TimetableGenerator />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
