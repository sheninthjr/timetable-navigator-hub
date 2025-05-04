import React, { useState, useEffect } from "react";
import { getTimetable, getSettings, getSubjectById, getStaffById, updateTimetable, getSubjects, getStaff } from "../../data/dataService";
import { getTimetable as getTimetable2, getSettings as getSettings2, getSubjectById as getSubjectById2, getStaffById as getStaffById2, updateTimetable as updateTimetable2, getSubjects as getSubjects2, getStaff as getStaff2 } from "../../data/dataService2";
import { TimeSlot, Subject, Staff } from "../../types/timetable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { generateTimetable } from "@/utils/timetableGenerator";

interface TimetableDisplayProps {
  semester?: string;
  section?: string;
}

const TimetableDisplay = ({ semester = "", section = "" }: TimetableDisplayProps) => {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timetable, setTimetable] = useState<TimeSlot[]>([]);
  const [settings, setSettings] = useState<any>(null);
  
  // Initialize data based on semester and section
  useEffect(() => {
    const isSem3SectionA = semester === 'sem3' && section === 'A';
    const isSem3SectionB = semester === 'sem3' && section === 'B';
    
    let currentSubjects: Subject[] = [];
    let currentStaff: Staff[] = [];
    let currentSettings: any = null;
    
    if (isSem3SectionA) {
      currentSubjects = getSubjects2();
      currentStaff = getStaff2();
      currentSettings = getSettings2();
    } else if (isSem3SectionB || (!semester && !section)) {
      currentSubjects = getSubjects();
      currentStaff = getStaff();
      currentSettings = getSettings();
    }
    
    setSubjects(currentSubjects);
    setStaff(currentStaff);
    setSettings(currentSettings);
    
    if (currentSettings && currentSubjects && currentStaff) {
      const generatedTimetable = generateTimetable(currentSubjects, currentStaff, currentSettings);
      setTimetable(generatedTimetable);
    }
  }, [semester, section]);

  // Early return if settings not loaded yet
  if (!settings) {
    return <div>Loading timetable...</div>;
  }
  
  // Get the appropriate data service functions based on the current context
  const dataService = {
    getTimetable: semester === 'sem3' && section === 'A' ? getTimetable2 : getTimetable,
    getSettings: semester === 'sem3' && section === 'A' ? getSettings2 : getSettings,
    getSubjectById: semester === 'sem3' && section === 'A' ? getSubjectById2 : getSubjectById,
    getStaffById: semester === 'sem3' && section === 'A' ? getStaffById2 : getStaffById,
    updateTimetable: semester === 'sem3' && section === 'A' ? updateTimetable2 : updateTimetable
  };
  
  // Extract days and periods
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = settings.periodTimings;
  
  // Generate timetable grid data
  const timetableGrid = days.map((day) => {
    return {
      day,
      slots: Array.from({ length: periods.length }, (_, i) => i + 1).map((periodNum) => {
        // Find the slot for this day and period
        const slot = timetable.find(
          (s) => s.day === day && s.period === periodNum && !s.isBreak
        );
        
        // Find any break that occurs after this period
        const breakAfter = timetable.find(
          (s) => s.day === day && s.period === periodNum + 0.5 && s.isBreak
        );
        
        return { 
          periodNum, 
          slot,
          breakAfter
        };
      }),
    };
  });
  
  const handleCellClick = (slot: TimeSlot | undefined) => {
    if (!isAuthenticated || !slot) return;
    
    setSelectedSlot(slot);
    setSelectedSubjectId(slot.subjectId || "");
    setIsEditing(true);
  };
  
  const handleSaveEdit = () => {
    if (!selectedSlot) return;
    
    const updatedSlot: TimeSlot = {
      ...selectedSlot,
      subjectId: selectedSubjectId || null,
      staffId: selectedSubjectId 
        ? dataService.getSubjectById(selectedSubjectId)?.staffId || null 
        : null,
    };
    
    dataService.updateTimetable(updatedSlot);
    setIsEditing(false);
    toast.success("Timetable updated successfully");
    
    // Update local timetable state to reflect changes
    setTimetable(prevTimetable => 
      prevTimetable.map(slot => 
        slot.day === selectedSlot.day && slot.period === selectedSlot.period
          ? updatedSlot
          : slot
      )
    );
  };
  
  const getCellClass = (slot?: TimeSlot): string => {
    if (!slot || !slot.subjectId) return "timetable-cell";
    
    const subject = dataService.getSubjectById(slot.subjectId);
    if (!subject) return "timetable-cell";
    
    const shortName = subject.shortName.split(" ")[0]; // Get first part before space
    
    if (subject.isLab) {
      return `timetable-cell cell-LAB`;
    }
    
    return `timetable-cell cell-${shortName}`;
  };
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-primary text-white">
              <th className="border p-2">Day / Period</th>
              {periods.map((period, index) => (
                <th key={index} className="border p-2 text-center">
                  Period {index + 1}
                  <br />
                  <span className="text-xs">
                    {period.startTime} - {period.endTime}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableGrid.map((dayRow) => (
              <React.Fragment key={dayRow.day}>
                <tr>
                  <td className="border p-2 font-semibold bg-gray-100">{dayRow.day}</td>
                  {dayRow.slots.map(({ periodNum, slot, breakAfter }) => {
                    const subject = slot?.subjectId ? dataService.getSubjectById(slot.subjectId) : null;
                    const teacher = slot?.staffId ? dataService.getStaffById(slot.staffId) : null;
                    
                    // If this slot spans two periods and it's the first period of the span,
                    // we'll render it with a colSpan of 2
                    if (slot?.spanTwoPeriods && periodNum % 2 === 1) {
                      return (
                        <td 
                          key={periodNum} 
                          className={getCellClass(slot)}
                          colSpan={2}
                          onClick={() => handleCellClick(slot)}
                        >
                          <div className="timetable-cell-content">
                            {subject ? (
                              <>
                                <div className="timetable-subject">
                                  {subject.shortName} ({subject.name})
                                </div>
                                {teacher && (
                                  <div className="timetable-faculty">
                                    {teacher.name}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-gray-400">Click to assign</div>
                            )}
                          </div>
                        </td>
                      );
                    }
                    
                    // If this is the second period of a 2-period span, skip it
                    if (
                      periodNum % 2 === 0 && 
                      dayRow.slots[periodNum - 2]?.slot?.spanTwoPeriods
                    ) {
                      return null;
                    }
                    
                    return (
                      <td 
                        key={periodNum} 
                        className={getCellClass(slot)}
                        onClick={() => handleCellClick(slot)}
                      >
                        <div className="timetable-cell-content">
                          {subject ? (
                            <>
                              <div className="timetable-subject">
                                {subject.shortName} ({subject.name})
                              </div>
                              {teacher && (
                                <div className="timetable-faculty">
                                  {teacher.name}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-gray-400">Click to assign</div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {dayRow.slots.some(({ breakAfter }) => breakAfter) && (
                  <tr>
                    <td className="timetable-break" colSpan={periods.length + 1}>
                      {dayRow.slots.find(({ breakAfter }) => breakAfter)?.breakAfter?.breakName || "Break"}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Timetable Slot</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <p className="text-sm font-semibold mb-1">Day</p>
              <p>{selectedSlot?.day}</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold mb-1">Period</p>
              <p>Period {selectedSlot?.period}</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold">
                Assign Subject
              </label>
              <Select 
                value={selectedSubjectId} 
                onValueChange={setSelectedSubjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.shortName} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedSubjectId && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Assigned Staff</p>
                  <p>
                    {dataService.getStaffById(
                      dataService.getSubjectById(selectedSubjectId)?.staffId || ""
                    )?.name || "None"}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimetableDisplay;