import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./theme/theme";

// Layout
import DashboardRootLayout from "./components/DashboardRootLayout";

// Routes
import PublicRoutes from "./routes/PublicRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import DashboardRoutes from "./routes/DashboardRoutes";

// Admin Pages
import DashboardIndex from "./pages/dashboard/admin/DashboardIndex";
import ManagerDetails from "./pages/dashboard/admin/ManagerDetails";
import EditManager from "./pages/dashboard/admin/EditManager";

// Manager Pages
import AddSchedule from "./pages/dashboard/manager/AddSchedule";
import ApproveRequest from "./pages/dashboard/manager/ApproveRequest";
import CurrentWaste from "./pages/dashboard/manager/CurrentWaste";
import EditSchedule from "./pages/dashboard/manager/EditSchedule";
import Schedule from "./pages/dashboard/manager/Schedule";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<PublicRoutes />} />

          {/* Auth Routes */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardRootLayout />}>
            {/* Admin Routes */}
            <Route index element={<DashboardIndex />} />
            <Route path="admin/manager/:id" element={<ManagerDetails />} />
            <Route path="admin/edit-manager/:id" element={<EditManager />} />

            {/* Manager Routes */}
            <Route path="manager/add-schedule" element={<AddSchedule />} />
            <Route path="manager/approve-request" element={<ApproveRequest />} />
            <Route path="manager/current-waste" element={<CurrentWaste />} />
            <Route path="manager/edit-schedule/:id" element={<EditSchedule />} />
            <Route path="manager/schedule" element={<Schedule />} />

            {/* Catch-all fallback inside Dashboard */}
            <Route path="*" element={<DashboardRoutes />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
