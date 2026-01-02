import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/auth-context";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Programs from "./pages/Programs";
import Mission from "./pages/about/Mission";
import History from "./pages/about/History";
import Board from "./pages/about/Board";
import Gallery from "./pages/archives/Gallery";
import GalleryYear from "./pages/archives/GalleryYear";
import Publications from "./pages/archives/Publications";
import Membership from "./pages/support/Membership";
import Partners from "./pages/support/Partners";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminPrograms from "./pages/admin/Programs";
import AdminPhotos from "./pages/admin/Photos";
import AdminLogin from "./pages/admin/Login";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/about/mission" element={<Mission />} />
          <Route path="/about/history" element={<History />} />
          <Route path="/about/board" element={<Board />} />
          <Route path="/archives/gallery" element={<Gallery />} />
          <Route path="/archives/gallery/:year" element={<GalleryYear />} />
          <Route path="/archives/publications" element={<Publications />} />
          <Route path="/support/membership" element={<Membership />} />
          <Route path="/support/partners" element={<Partners />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs"
            element={
              <ProtectedRoute>
                <AdminPrograms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/photos"
            element={
              <ProtectedRoute>
                <AdminPhotos />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
