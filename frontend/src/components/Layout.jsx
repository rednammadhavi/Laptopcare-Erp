import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const Layout = ({ children }) => (
    <div className="min-h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="p-6">{children}</main>
        </div>
    </div>
);
