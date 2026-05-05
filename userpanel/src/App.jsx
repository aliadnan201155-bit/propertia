import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

import RoleProtectedRoute from "./components/RoleProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";

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
  exit: { opacity: 0, y: -20 },
};

// App Layout component
const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { user } = useAuth();

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

            <Route path="/login" element={<Login />} />
              <Route path="/" element={<RoleRedirect />} />
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

            <Route element={<ProtectedRoute />}>

              <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/properties" element={<AdminProperties />} />
                <Route path="/admin/add" element={<Add />} />
                <Route path="/admin/update/:id" element={<Update />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
              </Route>

              <Route element={<RoleProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/owner/dashboard" element={<Dashboard />} />
                <Route path="/owner/list" element={<PropertyListings />} />
                <Route path="/owner/add" element={<Add />} />
                <Route path="/owner/update/:id" element={<Update />} />
                <Route path="/owner/appointments" element={<Appointments />} />
                <Route path="/owner/my-meetings" element={<MyMeetings />} />
              </Route>

            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
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
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
