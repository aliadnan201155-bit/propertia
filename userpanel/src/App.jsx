import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";



// Context
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorFallback from "./components/ErrorFallback";

// Pages
import Login from "./components/login";
import Dashboard from "./pages/Dashboard";
import PropertyListings from "./pages/List";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Appointments from "./pages/Appointments";
import UsersManagement from "./pages/Users";
import AdminProperties from "./pages/AdminProperties";
import AdminAppointments from "./pages/AdminAppointments";

// Config
import { APP_CONSTANTS } from "./config/constants";
import MyMeetings from "./pages/MyMeetings";

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// App Layout component
const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && <Navbar />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3 }}
          className={!isLoginPage ? "pt-16" : ""}
        >
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/list"
                element={isAdmin ? <Navigate to="/admin/properties" replace /> : <PropertyListings />}
              />
              <Route path="/add" element={<Add />} />
              <Route path="/update/:id" element={<Update />} />
              <Route
                path="/appointments"
                element={isAdmin ? <Navigate to="/admin/appointments" replace /> : <Appointments />}
              />
              <Route
                path="/my-meetings"
                element={isAdmin ? <Navigate to="/dashboard" replace /> : <MyMeetings />}
              />
              <Route
                path="/users"
                element={isAdmin ? <UsersManagement /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/admin/properties"
                element={isAdmin ? <AdminProperties /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/admin/appointments"
                element={isAdmin ? <AdminAppointments /> : <Navigate to="/dashboard" replace />}
              />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AuthProvider>
        <AppLayout />
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: APP_CONSTANTS.DEFAULT_TOAST_DURATION,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;