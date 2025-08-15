import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { ContactPage } from './pages/ContactPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CounsellorDashboard } from './pages/CounsellorDashboard';
import { FinancialServicesPage } from './pages/FinancialServicesPage';
import { SiteNav } from './components/SiteNav';
import { AuthProvider } from './context/AuthContext';
import PeerCounsellingPage from './pages/PeerCounsellingPage';
import AuthRegisterPage from './pages/AuthRegisterPage';
import AuthVerifyPage from './pages/AuthVerifyPage';
import AuthLoginPage from './pages/AuthLoginPage';

export const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <SiteNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/peer-counselling" element={<PeerCounsellingPage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/counsellor" element={<CounsellorDashboard />} />
        <Route path="/financial" element={<FinancialServicesPage />} />
        <Route path="/auth/register" element={<AuthRegisterPage />} />
        <Route path="/auth/verify" element={<AuthVerifyPage />} />
        <Route path="/auth/login" element={<AuthLoginPage />} />
        <Route path="*" element={<div style={{padding:'4rem',textAlign:'center'}}>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
