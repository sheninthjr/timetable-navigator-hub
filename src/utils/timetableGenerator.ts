
import { Subject, Staff, TimeSlot, TimetableSettings } from "../types/timetable";

export const generateTimetable = (
  subjects: Subject[],
  staff: Staff[],
  settings: TimetableSettings
): TimeSlot[] => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periodsPerDay = settings.periodTimings.length;
  const timetable: TimeSlot[] = [];

  // Create empty timetable with breaks
  days.forEach((day) => {
    for (let period = 1; period <= periodsPerDay; period++) {
      // Add regular periods
      timetable.push({
        day,
        period,
        subjectId: null,
        staffId: null,
      });
    }
  });

  // Sort subjects by priority (labs first, then regular subjects)
  const sortedSubjects = [...subjects].sort((a, b) => {
    // Labs have higher priority
    if (a.isLab && !b.isLab) return -1;
    if (!a.isLab && b.isLab) return 1;
    // Then sort by custom priority value
    return a.priority - b.priority;
  });

  // Schedule lab sessions first (they take 2 consecutive periods)
  const labSubjects = sortedSubjects.filter((subject) => subject.isLab);
  labSubjects.forEach((lab) => {
    let assigned = false;
    let attempts = 0;
    const maxAttempts = days.length * 3; // Avoid infinite loop

    while (!assigned && attempts < maxAttempts) {
      // Try to find 2 consecutive free periods
      const dayIndex = Math.floor(Math.random() * days.length);
      const day = days[dayIndex];
      
      // Start from a random period but ensure we don't exceed the day length
      const startPeriodOptions = [1, 3, 6]; // Periods 1-2, 3-4, 6-7 (avoiding breaks)
      const startPeriodIndex = Math.floor(Math.random() * startPeriodOptions.length);
      const startPeriod = startPeriodOptions[startPeriodIndex];
      
      // Check if both periods are free
      const firstPeriodSlot = timetable.find(
        (slot) => slot.day === day && slot.period === startPeriod
      );
      const secondPeriodSlot = timetable.find(
        (slot) => slot.day === day && slot.period === startPeriod + 1
      );

      if (
        firstPeriodSlot && 
        secondPeriodSlot && 
        !firstPeriodSlot.subjectId && 
        !secondPeriodSlot.subjectId
      ) {
        // Assign lab to both periods
        firstPeriodSlot.subjectId = lab.id;
        firstPeriodSlot.staffId = lab.staffId;
        firstPeriodSlot.spanTwoPeriods = true;
        
        secondPeriodSlot.subjectId = lab.id;
        secondPeriodSlot.staffId = lab.staffId;
        secondPeriodSlot.spanTwoPeriods = true;
        
        assigned = true;
      }
      
      attempts++;
    }
    
    // If we couldn't assign the lab after max attempts, let's force assign it
    if (!assigned) {
      // Find the first available 2 consecutive slots
      for (let dayIndex = 0; dayIndex < days.length && !assigned; dayIndex++) {
        const day = days[dayIndex];
        
        for (let period = 1; period < periodsPerDay && !assigned; period++) {
          // Skip if we're at a break period
          if (settings.breaks.some(b => b.after === period)) {
            continue;
          }
          
          const firstPeriodSlot = timetable.find(
            (slot) => slot.day === day && slot.period === period
          );
          const secondPeriodSlot = timetable.find(
            (slot) => slot.day === day && slot.period === period + 1
          );
          
          if (
            firstPeriodSlot && 
            secondPeriodSlot && 
            !firstPeriodSlot.subjectId && 
            !secondPeriodSlot.subjectId
          ) {
            // Force assign lab
            firstPeriodSlot.subjectId = lab.id;
            firstPeriodSlot.staffId = lab.staffId;
            firstPeriodSlot.spanTwoPeriods = true;
            
            secondPeriodSlot.subjectId = lab.id;
            secondPeriodSlot.staffId = lab.staffId;
            secondPeriodSlot.spanTwoPeriods = true;
            
            assigned = true;
          }
        }
      }
    }
  });

  // Distribute regular subjects
  const regularSubjects = sortedSubjects.filter((subject) => !subject.isLab);
  regularSubjects.forEach((subject) => {
    let periodsAssigned = 0;
    
    while (periodsAssigned < subject.periodsPerWeek) {
      // Try to find a free period
      let assigned = false;
      let attempts = 0;
      const maxAttempts = timetable.length; // Avoid infinite loop
      
      while (!assigned && attempts < maxAttempts) {
        // Pick a random day and period
        const dayIndex = Math.floor(Math.random() * days.length);
        const day = days[dayIndex];
        const periodIndex = Math.floor(Math.random() * periodsPerDay) + 1;
        
        // Check if period is free
        const timeSlot = timetable.find(
          (slot) => slot.day === day && slot.period === periodIndex
        );
        
        if (timeSlot && !timeSlot.subjectId && !timeSlot.isBreak) {
          // Check if the staff is already teaching in another class at this time
          const staffBusy = timetable.some(
            (slot) => 
              slot.day === day && 
              slot.period === periodIndex && 
              slot.staffId === subject.staffId
          );
          
          if (!staffBusy) {
            // Assign subject to period
            timeSlot.subjectId = subject.id;
            timeSlot.staffId = subject.staffId;
            
            assigned = true;
            periodsAssigned++;
          }
        }
        
        attempts++;
      }
      
      // If we couldn't assign a period after max attempts, force assign it
      if (!assigned) {
        // Find the first available slot
        for (let dayIndex = 0; dayIndex < days.length && !assigned; dayIndex++) {
          const day = days[dayIndex];
          
          for (let period = 1; period <= periodsPerDay && !assigned; period++) {
            const timeSlot = timetable.find(
              (slot) => slot.day === day && slot.period === period
            );
            
            if (timeSlot && !timeSlot.subjectId && !timeSlot.isBreak) {
              // Force assign subject even if staff is busy elsewhere
              timeSlot.subjectId = subject.id;
              timeSlot.staffId = subject.staffId;
              
              assigned = true;
              periodsAssigned++;
            }
          }
        }
      }
      
      // If still not assigned, break to avoid infinite loop
      if (!assigned) break;
    }
  });

  // Add breaks to the timetable
  days.forEach((day) => {
    settings.breaks.forEach((breakInfo) => {
      timetable.push({
        day,
        period: breakInfo.after + 0.5, // Position breaks between periods
        subjectId: null,
        staffId: null,
        isBreak: true,
        breakName: breakInfo.name,
      });
    });
  });

  // Sort the timetable by day and period for display
  return timetable.sort((a, b) => {
    const dayOrder = days.indexOf(a.day) - days.indexOf(b.day);
    if (dayOrder !== 0) return dayOrder;
    return a.period - b.period;
  });
};
