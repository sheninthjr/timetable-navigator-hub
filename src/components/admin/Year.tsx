import React from "react";
import { useNavigate } from "react-router-dom";
import AdminTabs from "./AdminTabs";

export default function Year() {
    const navigate = useNavigate();
    const pathParts = window.location.pathname.split('/');
    const currentSem = pathParts[2];
    const currentSection = pathParts[3];

    return(
        <div className="space-y-4">
            <div className="flex gap-4">
                <button 
                    onClick={() => navigate("/admin/sem3/A")}
                    className={`px-4 py-2 rounded ${
                        currentSem === 'sem3' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Sem 3
                </button>
                <button 
                    onClick={() => navigate("/admin/sem4/A")}
                    className={`px-4 py-2 rounded ${
                        currentSem === 'sem4' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Sem 4
                </button>
            </div>
            
            {currentSem && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Select Section</h3>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate(`/admin/${currentSem}/A`)}
                            className={`px-4 py-2 rounded ${
                                currentSection === 'A' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            Section A
                        </button>
                        <button 
                            onClick={() => navigate(`/admin/${currentSem}/B`)}
                            className={`px-4 py-2 rounded ${
                                currentSection === 'B' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                        >
                            Section B
                        </button>
                    </div>
                </div>
            )}
            
            {currentSem && currentSection && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Admin Panel - {currentSem.toUpperCase()} {currentSection}
                    </h2>
                    <AdminTabs />
                </div>
            )}
        </div>
    )
}