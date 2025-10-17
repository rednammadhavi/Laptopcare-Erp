import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Icon = ({ children }) => (
    <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-sm">
        {children}
    </div>
);

const NavItem = ({ to, label, children, roles = [] }) => {
    const { hasAnyRole } = useAuth();
    const location = useLocation();

    // If roles specified and user doesn't have any of them, don't render
    if (roles.length > 0 && !hasAnyRole(roles)) {
        return null;
    }

    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-50 ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`}
        >
            <Icon>{children}</Icon>
            <span>{label}</span>
        </Link>
    );
};

export const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="w-64 bg-white border-r h-screen sticky top-0">
            <div className="p-4 border-b">
                <Link to="/" className="font-bold text-lg block">
                    LaptopCare
                </Link>
                <div className="text-xs text-gray-500">
                    {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard` : 'ERP Dashboard'}
                </div>
            </div>
            <nav className="p-4 space-y-1">
                <NavItem to="/" label="Dashboard">🏠</NavItem>
                <NavItem to="/customers" label="Customers" roles={['admin', 'manager', 'receptionist']}>👥</NavItem>
                <NavItem to="/jobs" label="Jobs" roles={['admin', 'manager', 'technician']}>🛠️</NavItem>
                <NavItem to="/inventory" label="Inventory" roles={['admin', 'manager']}>📦</NavItem>
                <NavItem to="/reports" label="Reports" roles={['admin', 'manager']}>📊</NavItem>
            </nav>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                <div className="text-sm font-medium text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
        </aside>
    );
};