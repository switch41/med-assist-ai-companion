
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SymptomChecker from "./pages/SymptomChecker";
import Medications from "./pages/Medications";
import Appointments from "./pages/Appointments";
import HealthRecords from "./pages/HealthRecords";
import Vitals from "./pages/Vitals";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth route outside the main layout */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Main layout with sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/health-records" element={<HealthRecords />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
          
          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
