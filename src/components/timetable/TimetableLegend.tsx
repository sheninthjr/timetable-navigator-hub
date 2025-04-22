
import React from "react";
import { getSubjects } from "../../data/dataService";

const TimetableLegend = () => {
  const subjects = getSubjects();
  const uniqueTypes = Array.from(
    new Set(subjects.map((subject) => subject.isLab ? "LAB" : subject.shortName.split(" ")[0]))
  );

  return (
    <div className="mt-8 p-4 border rounded bg-white">
      <h3 className="font-medium mb-3">Legend</h3>
      <div className="flex flex-wrap gap-4">
        {uniqueTypes.map((type) => (
          <div key={type} className="flex items-center">
            <div 
              className={`w-4 h-4 mr-2 border-l-4 ${
                type === "LAB" 
                  ? "border-l-blue-400 bg-blue-100" 
                  : `border-l-${type.toLowerCase()}-500 bg-${type.toLowerCase()}-50`
              }`}
            ></div>
            <span className="text-sm">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableLegend;
