
import { Staff, Subject, TimeSlot, TimetableSettings, ClassDetails } from "../types/timetable";

// In-memory storage (in a real app, this would use local storage or a backend)
let staffData: Staff[] = [
  {
    id: "1",
    name: "Sagaya Rebecca",
    phoneNumber: "9876543210",
    email: "sagaya@velammal.edu",
    department: "AI&DS",
  },
  {
    id: "2",
    name: "Sujitha",
    phoneNumber: "9876543211",
    email: "sujitha@velammal.edu",
    department: "AI&DS",
  },
  {
    id: "3",
    name: "P. Abirami",
    phoneNumber: "9876543212",
    email: "abirami@velammal.edu",
    department: "AI&DS",
  },
  {
    id: "4",
    name: "Vidya",
    phoneNumber: "9876543213",
    email: "vidya@velammal.edu",
    department: "AI&DS",
  },
  {
    id: "5",
    name: "Justin Xavier",
    phoneNumber: "9876543214",
    email: "justin@velammal.edu",
    department: "AI&DS",
  },
  {
    id: "6",
    name: "Siva Karthikeyan",
    phoneNumber: "9876543215",
    email: "siva@velammal.edu",
    department: "AI&DS",
  },
];

let subjectData: Subject[] = [
  {
    id: "1",
    code: "MA8402",
    name: "Probability and Statistics",
    shortName: "PAS",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "1",
    priority: 1,
  },
  {
    id: "2",
    code: "CS8491",
    name: "Operating Systems",
    shortName: "OS",
    periodsPerWeek: 6,
    isLab: false,
    staffId: "2",
    priority: 1,
  },
  {
    id: "3",
    code: "CS8491",
    name: "Machine Learning",
    shortName: "ML",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "3",
    priority: 1,
  },
  {
    id: "4",
    code: "AD8401",
    name: "Fundamentals of Data Science and Analytics",
    shortName: "FDSA",
    periodsPerWeek: 5,
    isLab: false,
    staffId: "4",
    priority: 1,
  },
  {
    id: "5",
    code: "CS8591",
    name: "Computer Networks",
    shortName: "CN",
    periodsPerWeek: 6,
    isLab: false,
    staffId: "5",
    priority: 1,
  },
  {
    id: "6",
    code: "GE8561",
    name: "Environmental Sciences and Sustainability",
    shortName: "EVS",
    periodsPerWeek: 4,
    isLab: false,
    staffId: "6",
    priority: 2,
  },
  {
    id: "7",
    code: "AD8411",
    name: "Data Science and Analytics Laboratory",
    shortName: "FDSA LAB",
    periodsPerWeek: 3,
    isLab: true,
    staffId: "4",
    priority: 3,
  },
  {
    id: "8",
    code: "CS8581",
    name: "Machine Learning Laboratory",
    shortName: "ML LAB",
    periodsPerWeek: 3,
    isLab: true,
    staffId: "3",
    priority: 3,
  },
  {
    id: "9",
    code: "CS8581",
    name: "Computer Networks Laboratory",
    shortName: "CN LAB",
    periodsPerWeek: 3,
    isLab: true,
    staffId: "5",
    priority: 3,
  },
  {
    id: "10",
    code: "AD8071",
    name: "Department Activity Hour",
    shortName: "ACTIVITY",
    periodsPerWeek: 2,
    isLab: false,
    staffId: "4",
    priority: 4,
  },
  {
    id: "11",
    code: "HS8581",
    name: "Professional Development",
    shortName: "PD",
    periodsPerWeek: 2,
    isLab: false,
    staffId: "4",
    priority: 2,
  },
  {
    id: "12",
    code: "LIB1001",
    name: "Library / Skill Rack",
    shortName: "LIB/SKILL RACK",
    periodsPerWeek: 1,
    isLab: false,
    staffId: "4",
    priority: 5,
  },
];

let timetableData: TimeSlot[] = [];

let settingsData: TimetableSettings = {
  classDetails: {
    institution: "Velammal Institute of Technology",
    department: "Artificial Intelligence and Data Science",
    academicYear: "2024–2025 Even Semester",
    effectiveFrom: "24.02.2025",
    year: "II",
    semester: "IV",
    branch: "AI&DS",
    section: "B",
  },
  periodTimings: [
    { startTime: "8:30", endTime: "9:20" },
    { startTime: "9:20", endTime: "10:10" },
    { startTime: "10:10", endTime: "11:00" },
    { startTime: "11:15", endTime: "12:00" },
    { startTime: "12:00", endTime: "12:45" },
    { startTime: "13:35", endTime: "14:25" },
    { startTime: "14:25", endTime: "15:15" },
  ],
  breaks: [
    { after: 3, name: "Tea Break" },
    { after: 5, name: "Lunch Break" },
  ],
};

export const getStaff = (): Staff[] => {
  return [...staffData];
};

export const getSubjects = (): Subject[] => {
  return [...subjectData];
};

export const getTimetable = (): TimeSlot[] => {
  return [...timetableData];
};

export const getSettings = (): TimetableSettings => {
  return { ...settingsData };
};

export const addStaff = (staff: Staff): void => {
  staffData.push(staff);
};

export const updateStaff = (updatedStaff: Staff): void => {
  staffData = staffData.map((staff) =>
    staff.id === updatedStaff.id ? updatedStaff : staff
  );
};

export const addSubject = (subject: Subject): void => {
  subjectData.push(subject);
};

export const updateSubject = (updatedSubject: Subject): void => {
  subjectData = subjectData.map((subject) =>
    subject.id === updatedSubject.id ? updatedSubject : subject
  );
};

export const updateTimetable = (timeSlot: TimeSlot): void => {
  const existingSlotIndex = timetableData.findIndex(
    (slot) => slot.day === timeSlot.day && slot.period === timeSlot.period
  );

  if (existingSlotIndex >= 0) {
    timetableData[existingSlotIndex] = timeSlot;
  } else {
    timetableData.push(timeSlot);
  }
};

export const updateSettings = (settings: TimetableSettings): void => {
  settingsData = settings;
};

export const saveTimetable = (newTimetable: TimeSlot[]): void => {
  timetableData = newTimetable;
};

// Initialize an empty timetable if needed
export const initializeEmptyTimetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = 7;
  const emptyTimetable: TimeSlot[] = [];

  days.forEach((day) => {
    for (let period = 1; period <= periods; period++) {
      if (
        settingsData.breaks.find((b) => b.after === period) ||
        settingsData.breaks.find((b) => b.after === period - 1)
      ) {
        continue; // Skip break slots
      }

      emptyTimetable.push({
        day,
        period,
        subjectId: null,
        staffId: null,
      });
    }
  });

  timetableData = emptyTimetable;
  return emptyTimetable;
};

export const getSubjectById = (id: string | null): Subject | undefined => {
  if (!id) return undefined;
  return subjectData.find((subject) => subject.id === id);
};

export const getStaffById = (id: string | null): Staff | undefined => {
  if (!id) return undefined;
  return staffData.find((staff) => staff.id === id);
};

export const getStaffBySubjectId = (subjectId: string | null): Staff | undefined => {
  if (!subjectId) return undefined;
  const subject = getSubjectById(subjectId);
  if (!subject) return undefined;
  return getStaffById(subject.staffId);
};

export const updateClassDetails = (details: ClassDetails): void => {
  settingsData.classDetails = details;
};
