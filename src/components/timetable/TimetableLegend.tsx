import React from "react";
import { getSettings } from "../../data/dataService";
import { getSettings as getSettings2 } from "../../data/dataService2";

interface TimetableLegendProps {
  semester?: string;
  section?: string;
}

const TimetableLegend = ({ semester, section }: TimetableLegendProps) => {
  // Get the appropriate data service functions based on the current context
  const getCurrentDataService = () => {
    if (semester === 'sem3' && section === 'A') {
      return {
        getSettings: getSettings2,
      };
    }
    return {
      getSettings,
    };
  };

  const settings = getCurrentDataService().getSettings();

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Period Timings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-800">Regular Periods</h4>
          <ul className="mt-2 space-y-1">
            {settings.periodTimings.map((timing, index) => (
              <li key={index} className="text-sm text-gray-600">
                Period {index + 1}: {timing.startTime} - {timing.endTime}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-800">Breaks</h4>
          <ul className="mt-2 space-y-1">
            {settings.breaks.map((break_, index) => (
              <li key={index} className="text-sm text-gray-600">
                {break_.name}: After Period {break_.after}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimetableLegend;
