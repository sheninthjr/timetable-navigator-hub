
import React, { useState, useEffect } from "react";
import { getStaff, addStaff, updateStaff } from "../../data/dataService";
import { Staff } from "../../types/timetable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface StaffManagerProps {
  onComplete: () => void;
}

const StaffManager: React.FC<StaffManagerProps> = ({ onComplete }) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff>({
    id: "",
    name: "",
    phoneNumber: "",
    email: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = () => {
    const staff = getStaff();
    setStaffList(staff);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateStaff(currentStaff);
      toast.success("Staff updated successfully");
    } else {
      const newStaff = {
        ...currentStaff,
        id: Date.now().toString(), // Simple ID generation
      };
      addStaff(newStaff);
      toast.success("Staff added successfully");
    }
    
    setIsDialogOpen(false);
    resetForm();
    loadStaffData();
  };

  const handleEdit = (staff: Staff) => {
    setCurrentStaff(staff);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setCurrentStaff({
      id: "",
      name: "",
      phoneNumber: "",
      email: "",
      department: "",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Add or edit staff details</CardDescription>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add New Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Staff Details" : "Add New Staff"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  name="name"
                  value={currentStaff.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ms. Sagaya Rebecca"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={currentStaff.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9876543210"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentStaff.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. name@velammal.edu"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">Department</label>
                <Input
                  id="department"
                  name="department"
                  value={currentStaff.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g. AI&DS"
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">{isEditing ? "Update" : "Add"} Staff</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {staffList.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No staff added yet. Add staff members to continue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted border-b">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Phone Number</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{staff.name}</td>
                    <td className="p-2">{staff.phoneNumber}</td>
                    <td className="p-2">{staff.email}</td>
                    <td className="p-2">{staff.department}</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(staff)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={onComplete}>Continue to Subjects</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffManager;
