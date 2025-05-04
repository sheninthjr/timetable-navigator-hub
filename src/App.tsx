import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminTabs from "./components/admin/AdminTabs";
import { getSettings as getSettings2, getStaff as getStaff2, getSubjects as getSubjects2 } from "./data/dataService2";

const queryClient = new QueryClient();

const SectionAdmin = ({ semester, section }: { semester: string; section: string }) => {
  // Update the settings with the current semester and section
  const settings = getSettings2();
  settings.classDetails.semester = semester === 'sem3' ? 'III' : 'IV';
  settings.classDetails.section = section;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard - {semester.toUpperCase()} Section {section}
        </h1>
        <AdminTabs 
          initialStaff={getStaff2()}
          initialSubjects={getSubjects2()}
          initialSettings={settings}
        />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sem3/A" element={<Index semester="sem3" section="A" />} />
            <Route path="/sem3/B" element={<Index semester="sem3" section="B" />} />
            <Route path="/sem4/A" element={<Index semester="sem4" section="A" />} />
            <Route path="/sem4/B" element={<Index semester="sem4" section="B" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/sem3/A" element={<SectionAdmin semester="sem3" section="A" />} />
            <Route path="/admin/sem3/B" element={<SectionAdmin semester="sem3" section="B" />} />
            <Route path="/admin/sem4/A" element={<SectionAdmin semester="sem4" section="A" />} />
            <Route path="/admin/sem4/B" element={<SectionAdmin semester="sem4" section="B" />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
