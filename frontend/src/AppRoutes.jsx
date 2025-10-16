import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import { Layout } from "./components/Layout";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";

import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";

import { CustomersList } from "./pages/Customers/CustomersList";
import { CustomerDetail } from "./pages/Customers/CustomerDetail";
import { CustomerForm } from "./pages/Customers/CustomerForm";

import { TechnicianList } from "./pages/Technician/TechnicianList";
import { TechnicianDetail } from "./pages/Technician/TechnicianDetail";

import { JobsPage } from "./pages/Jobs/Jobs";
import { JobForm } from "./pages/Jobs/JobForm";
import { JobDetail } from "./pages/Jobs/JobDetail";

import { Inventory } from "./pages/Inventory";
import { ReportsPage } from "./pages/Reports";

const RequireAuth = ({ children, roles = [] }) => {
    const { user, hasRole } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (roles.length > 0 && !hasRole(roles)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You don’t have permission to access this page.
                    </p>
                    <Navigate to="/" replace />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

// PublicRoute (redirects if logged in)
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) return <Navigate to="/" replace />;
    return <>{children}</>;
};

// Main route configuration
const AppRoutes = () => (
    <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Dashboard */}
        <Route path="/" element={
            <RequireAuth>
                <Layout><Dashboard /></Layout>
            </RequireAuth>
        } />

        {/* Customer Management */}
        <Route path="/customers" element={
            <RequireAuth roles={['admin', 'manager', 'technician']}>
                <Layout><CustomersList /></Layout>
            </RequireAuth>
        } />
        <Route path="/customers/new" element={
            <RequireAuth roles={['admin', 'manager', 'receptionist']}>
                <Layout><CustomerForm /></Layout>
            </RequireAuth>
        } />
        <Route path="/customers/:id" element={
            <RequireAuth roles={['admin', 'manager', 'technician', 'receptionist']}>
                <Layout><CustomerDetail /></Layout>
            </RequireAuth>
        } />
        <Route path="/customers/:id/edit" element={
            <RequireAuth roles={['admin', 'manager', 'receptionist']}>
                <Layout><CustomerForm /></Layout>
            </RequireAuth>
        } />

        {/* Technician Management */}
        <Route path="/technicians" element={
            <RequireAuth roles={['admin', 'manager']}>
                <Layout><TechnicianList /></Layout>
            </RequireAuth>
        } />
        <Route path="/technicians/:id" element={
            <RequireAuth roles={['admin', 'manager']}>
                <Layout><TechnicianDetail /></Layout>
            </RequireAuth>
        } />

        {/* Jobs */}
        <Route path="/jobs" element={
            <RequireAuth roles={['admin', 'manager', 'technician']}>
                <Layout><JobsPage /></Layout>
            </RequireAuth>
        } />
        <Route path="/jobs/new" element={
            <RequireAuth roles={['admin', 'manager']}>
                <Layout><JobForm /></Layout>
            </RequireAuth>
        } />
        <Route path="/jobs/:id" element={
            <RequireAuth roles={['admin', 'manager', 'technician']}>
                <Layout><JobDetail /></Layout>
            </RequireAuth>
        } />
        <Route path="/jobs/:id/edit" element={
            <RequireAuth roles={['admin', 'manager']}>
                <Layout><JobForm /></Layout>
            </RequireAuth>
        } />

        {/* Management */}
        <Route path="/inventory" element={
            <RequireAuth roles={['admin', 'manager']}>
                <Layout><Inventory /></Layout>
            </RequireAuth>
        } />
        <Route path="/reports" element={
            <RequireAuth roles={['admin', 'manager']}>
                <Layout><ReportsPage /></Layout>
            </RequireAuth>
        } />

        <Route path="*" element={<NotFound />} />
    </Routes>
);

export default AppRoutes;
