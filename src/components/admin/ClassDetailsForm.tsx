
import React, { useState, useEffect } from "react";
import { getSettings, updateClassDetails } from "../../data/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ClassDetailsFormProps {
  onComplete: () => void;
}

const ClassDetailsForm: React.FC<ClassDetailsFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    institution: "",
    department: "",
    academicYear: "",
    effectiveFrom: "",
    year: "",
    semester: "",
    branch: "",
    section: "",
  });

  useEffect(() => {
    // Load existing settings if available
    const settings = getSettings();
    if (settings.classDetails) {
      setFormData(settings.classDetails);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassDetails(formData);
    toast.success("Class details saved successfully");
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Details</CardTitle>
        <CardDescription>
          Enter the details of the class for which you want to generate a timetable
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="institution" className="text-sm font-medium">Institution Name</label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
                placeholder="e.g. Velammal Institute of Technology"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">Department</label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="e.g. Artificial Intelligence and Data Science"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="academicYear" className="text-sm font-medium">Academic Year</label>
              <Input
                id="academicYear"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                required
                placeholder="e.g. 2024–2025 Even Semester"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="effectiveFrom" className="text-sm font-medium">Effective From</label>
              <Input
                id="effectiveFrom"
                name="effectiveFrom"
                value={formData.effectiveFrom}
                onChange={handleChange}
                required
                placeholder="e.g. 24.02.2025"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">Year</label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                placeholder="e.g. II"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="semester" className="text-sm font-medium">Semester</label>
              <Input
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                placeholder="e.g. IV"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="branch" className="text-sm font-medium">Branch</label>
              <Input
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                placeholder="e.g. AI&DS"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="section" className="text-sm font-medium">Section</label>
              <Input
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                placeholder="e.g. B"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save & Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClassDetailsForm;
