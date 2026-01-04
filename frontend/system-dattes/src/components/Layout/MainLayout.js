import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Topbar />
            <main className="md:ml-64 pt-16">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
