import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Icon = ({ children }) => (
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 text-lg">
        {children}
    </div>
);

const NavItem = ({ to, label, children, roles = [] }) => {
    const { hasAnyRole } = useAuth();
    const location = useLocation();

    if (roles.length > 0 && !hasAnyRole(roles)) return null;

    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${isActive
                    ? "bg-blue-100 text-blue-700 border-r-4 border-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
        <aside className="w-64 bg-white shadow-md border-r border-gray-100 h-screen sticky top-0 flex flex-col justify-between">
            <div>
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="text-xl font-extrabold text-blue-700 tracking-wide">
                        LaptopCare
                    </Link>
                    <div className="text-xs text-gray-500 mt-1">
                        {user?.role
                            ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`
                            : "ERP Dashboard"}
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <NavItem to="/" label="Dashboard">🏠</NavItem>
                    <NavItem to="/customers" label="Customers" roles={['admin', 'manager', 'receptionist']}>👥</NavItem>
                    <NavItem to="/jobs" label="Jobs" roles={['admin', 'manager', 'technician']}>🛠️</NavItem>
                    <NavItem to="/inventory" label="Inventory" roles={['admin', 'manager']}>📦</NavItem>
                    <NavItem to="/reports" label="Reports" roles={['admin', 'manager']}>📊</NavItem>
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
        </aside>
    );
};
