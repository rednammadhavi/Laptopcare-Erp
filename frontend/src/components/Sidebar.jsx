import React from "react";
import { Link } from "react-router-dom";

const Icon = ({ children }) => (
    <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-sm">
        {children}
    </div>
);

const NavItem = ({ to, label, children }) => (
    <Link to={to} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
        <Icon>{children}</Icon>
        <span>{label}</span>
    </Link>
);

export const Sidebar = () => (
    <aside className="w-64 bg-white border-r h-screen sticky top-0">
        <div className="p-4 border-b">
            <Link to="/" className="font-bold text-lg block">
                LaptopCare
            </Link>
            <div className="text-xs text-gray-500">ERP Dashboard</div>
        </div>
        <nav className="p-4 space-y-1">
            <NavItem to="/" label="Dashboard">🏠</NavItem>
            <NavItem to="/customers" label="Customers">👥</NavItem>
            <NavItem to="/jobs" label="Jobs">🛠️</NavItem>
            <NavItem to="/inventory" label="Inventory">📦</NavItem>
            <NavItem to="/reports" label="Reports">📊</NavItem>
        </nav>
    </aside>
);
