
import React, { useState, useEffect } from "react";
import { getSubjects, addSubject, updateSubject, getStaff } from "../../data/dataService";
import { Subject, Staff } from "../../types/timetable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface SubjectManagerProps {
  onComplete: () => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ onComplete }) => {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject>({
    id: "",
    code: "",
    name: "",
    shortName: "",
    periodsPerWeek: 1,
    isLab: false,
    staffId: "",
    priority: 1,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const subjects = getSubjects();
    const staff = getStaff();
    setSubjectList(subjects);
    setStaffList(staff);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setCurrentSubject((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateSubject(currentSubject);
      toast.success("Subject updated successfully");
    } else {
      const newSubject = {
        ...currentSubject,
        id: Date.now().toString(), // Simple ID generation
      };
      addSubject(newSubject);
      toast.success("Subject added successfully");
    }
    
    setIsDialogOpen(false);
    resetForm();
    loadData();
  };

  const handleEdit = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setCurrentSubject({
      id: "",
      code: "",
      name: "",
      shortName: "",
      periodsPerWeek: 1,
      isLab: false,
      staffId: "",
      priority: 1,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subject Management</CardTitle>
          <CardDescription>Add or edit subject details</CardDescription>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add New Subject</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Subject Details" : "Add New Subject"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Subject Code</label>
                <Input
                  id="code"
                  name="code"
                  value={currentSubject.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g. MA8402"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Subject Name</label>
                <Input
                  id="name"
                  name="name"
                  value={currentSubject.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Probability and Statistics"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="shortName" className="text-sm font-medium">Short Name / Acronym</label>
                <Input
                  id="shortName"
                  name="shortName"
                  value={currentSubject.shortName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. PAS"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="periodsPerWeek" className="text-sm font-medium">Periods Per Week</label>
                <Input
                  id="periodsPerWeek"
                  name="periodsPerWeek"
                  type="number"
                  min={1}
                  max={10}
                  value={currentSubject.periodsPerWeek}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority (1-5, lower means higher priority)</label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min={1}
                  max={5}
                  value={currentSubject.priority}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isLab"
                  name="isLab"
                  checked={currentSubject.isLab}
                  onCheckedChange={(checked) => 
                    setCurrentSubject((prev) => ({ ...prev, isLab: checked }))
                  }
                />
                <label htmlFor="isLab" className="text-sm font-medium">
                  This is a lab subject (takes 2 consecutive periods)
                </label>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="staffId" className="text-sm font-medium">Assigned Staff</label>
                <Select 
                  value={currentSubject.staffId} 
                  onValueChange={(value) => handleSelectChange("staffId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffList.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">{isEditing ? "Update" : "Add"} Subject</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {subjectList.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No subjects added yet. Add subjects to continue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Short Name</th>
                  <th className="p-2 text-left">Periods/Week</th>
                  <th className="p-2 text-left">Staff</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Priority</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjectList.map((subject) => {
                  const assignedStaff = staffList.find((staff) => staff.id === subject.staffId);
                  
                  return (
                    <tr key={subject.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{subject.code}</td>
                      <td className="p-2">{subject.name}</td>
                      <td className="p-2">{subject.shortName}</td>
                      <td className="p-2">{subject.periodsPerWeek}</td>
                      <td className="p-2">{assignedStaff?.name || "Not assigned"}</td>
                      <td className="p-2">{subject.isLab ? "Lab" : "Theory"}</td>
                      <td className="p-2">{subject.priority}</td>
                      <td className="p-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(subject)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={onComplete}>Continue to Generate</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectManager;
