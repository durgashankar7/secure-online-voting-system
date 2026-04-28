import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; // Zomato style alerts ke liye

// Naye folders se files import karna
import LandingPage from './pages/LandingPage'; // Gateway Page
import LoginPage from './pages/LoginPage';
import VotePage from './pages/VotePage';
import DashboardLayout from './components/DashboardLayout';
import AdminPage from './pages/AdminPage';
import ElectionsPage from './pages/ElectionsPage';
import ResultsPage from './pages/ResultsPage';
import SessionTimeout from './components/SessionTimeout';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem("voterAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="text-center mt-20 font-bold text-indigo-900">Loading Secure Portal...</div>;

  return (
    <Router>
      {/* NAYA YAHAN HAI: SessionTimeout ne ab poore App ko wrap kar liya hai */}
      <SessionTimeout>
        
        {/* Toaster ko sabse upar rakha hai taaki har page par alerts dikhein */}
        <Toaster position="top-right" reverseOrder={false} />
        
        <Routes>
          {/* ========================================== */}
          {/* PUBLIC ROUTES (Jahan bina login ja sakte hain) */}
          {/* ========================================== */}
          
          {/* 1. Main Gateway (Landing Page) */}
          <Route path="/" element={<LandingPage />} />
          
          {/* 2. Voter Login Page */}
          <Route path="/voter-login" element={!isAuthenticated ? <LoginPage setAuth={setIsAuthenticated} /> : <Navigate to="/home" />} />
          
          {/* 3. Admin Page (Iska apna alag login system hai) */}
          <Route path="/admin" element={<AdminPage />} />


          {/* ========================================== */}
          {/* PROTECTED VOTER ROUTES (Sirf Voter Login ke baad) */}
          {/* ========================================== */}
          {isAuthenticated ? (
            <>
              <Route path="/home" element={<DashboardLayout setAuth={setIsAuthenticated}> <div className="bg-white p-8 rounded shadow border-t-4 border-indigo-900"> <h2 className="text-3xl font-extrabold text-slate-800">Welcome to Voter Portal</h2> <p className="mt-4 text-slate-600">Your secure session is active. Please select an option from the sidebar to continue.</p> </div> </DashboardLayout>} />
              <Route path="/elections" element={<DashboardLayout setAuth={setIsAuthenticated}> <ElectionsPage /> </DashboardLayout>} />
              <Route path="/vote" element={<DashboardLayout setAuth={setIsAuthenticated}> <VotePage /> </DashboardLayout>} />
              <Route path="/results" element={<DashboardLayout setAuth={setIsAuthenticated}> <ResultsPage /> </DashboardLayout>} />
              <Route path="/support" element={<DashboardLayout setAuth={setIsAuthenticated}> <h2 className="text-2xl font-bold">Help & Support Desk</h2> </DashboardLayout>} />
              <Route path="/profile" element={<DashboardLayout setAuth={setIsAuthenticated}> <ProfilePage /> </DashboardLayout>} />
            </>
          ) : null}

          {/* ========================================== */}
          {/* CATCH-ALL ROUTE (Agar koi galat URL daale) */}
          {/* ========================================== */}
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
      </SessionTimeout>
    </Router>
  );
}

export default App;