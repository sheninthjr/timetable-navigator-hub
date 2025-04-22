
export interface Staff {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  department: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  shortName: string;
  periodsPerWeek: number;
  isLab: boolean;
  staffId: string;
  priority: number;
}

export interface ClassDetails {
  institution: string;
  department: string;
  academicYear: string;
  effectiveFrom: string;
  year: string;
  semester: string;
  branch: string;
  section: string;
}

export interface Period {
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  day: string;
  period: number;
  subjectId: string | null;
  staffId: string | null;
  isBreak?: boolean;
  breakName?: string;
  spanTwoPeriods?: boolean;
}

export interface TimetableSettings {
  classDetails: ClassDetails;
  periodTimings: Period[];
  breaks: {
    after: number;
    name: string;
  }[];
}
