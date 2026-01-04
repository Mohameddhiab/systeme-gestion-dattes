import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Consulter() {
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Produits', path: '/tableproduit', icon: '📦', color: 'bg-blue-50 text-blue-600' },
        { title: 'Fumigation', path: '/tablefumigation', icon: '💨', color: 'bg-green-50 text-green-600' },
        { title: 'Triage', path: '/tabletriage', icon: '🔍', color: 'bg-purple-50 text-purple-600' },
        { title: 'Fournisseurs', path: '/tablefournisseur', icon: '🚚', color: 'bg-orange-50 text-orange-600' },
        { title: 'Stock Chambre 1', path: '/tablechambre1', icon: '🏭', color: 'bg-red-50 text-red-600' },
        { title: 'Stock Chambre 2', path: '/tablechambre2', icon: '🏭', color: 'bg-red-50 text-red-600' },
        { title: 'Stock Chambre 3', path: '/tablechambre3', icon: '🏭', color: 'bg-red-50 text-red-600' },
    ];

    return (
        <div className="p-8 w-full max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">
                Consulter les Données
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`${item.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 border border-transparent hover:border-current flex items-center gap-4`}
                    >
                        <div className="text-4xl">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="text-sm opacity-80">Voir le tableau</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
