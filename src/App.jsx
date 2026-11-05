import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import SplashScreen from './components/layout/SplashScreen';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReportProblem from './pages/ReportProblem';
import NotFound from './pages/NotFound';
import UserProfile from './roles/user/UserProfile';
import AdminDashboard from './roles/admin/AdminDashboard';
import AdminReports from './roles/admin/AdminReports';
import AdminCampaigns from './roles/admin/AdminCampaigns';
import WorkerDashboard from './roles/worker/WorkerDashboard';
import WorkerCampaigns from './roles/worker/WorkerCampaigns';

// Scroll to top on page change, or to a #section when the link has one
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 120);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  // The splash only shows on the first visit of a browser session, not on every navigation
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('nb_splash'));
  const location = useLocation();
  const section = location.pathname.split('/')[1] || 'home'; // keeps dashboard sidebar from re-mounting

  const finishSplash = () => { sessionStorage.setItem('nb_splash', '1'); setSplash(false); };

  return (
    <>
      <AnimatePresence>{splash && <SplashScreen onDone={finishSplash} />}</AnimatePresence>
      <ScrollManager />
      <AnimatePresence mode="wait">
        <motion.div key={section} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <Routes location={location}>
            {/* Public site: visible to everyone, whatever the role */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/report" element={<ReportProblem />} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<DashboardLayout role="admin" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="campaigns" element={<AdminCampaigns />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute roles={['worker']} />}>
              <Route path="/worker" element={<DashboardLayout role="worker" />}>
                <Route index element={<WorkerDashboard />} />
                <Route path="campaigns" element={<WorkerCampaigns />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
