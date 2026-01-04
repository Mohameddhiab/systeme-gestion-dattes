import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { path: '/consulter', label: 'Consulter', icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /> },
        { path: '/ajouter', label: 'Ajouter Produit', icon: <path d="M12 5v14M5 12h14" /> },
        { path: '/stockage', label: 'Stockage', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /> },
        { path: '/triage', label: 'Triage', icon: <path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7M8 12V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7" /> },
        { path: '/fumigation', label: 'Fumigation', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
        { path: '/fournisseurs', label: 'Fournisseurs', icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-secondary-200 h-screen fixed left-0 top-0 flex flex-col z-20 hidden md:flex">
            <div className="p-6 flex items-center justify-center border-b border-secondary-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        D
                    </div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">DattesSys</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                            }`
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-colors"
                        >
                            {item.icon}
                        </svg>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-secondary-100">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Déconnexion</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
