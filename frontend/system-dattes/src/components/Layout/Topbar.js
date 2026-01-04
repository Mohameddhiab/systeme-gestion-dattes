import React from 'react';

const Topbar = () => {
    return (
        <header className="bg-white border-b border-secondary-200 h-16 fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-800">Système de Gestion des Dattes</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">U</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
