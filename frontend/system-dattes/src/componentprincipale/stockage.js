import React, { useState } from 'react';
import StockageEntre from './stockage entree';
import StockageSortie from './stockage sortie';

export default function Stockage() {
    const [activeTab, setActiveTab] = useState('entree');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="glass-panel p-6 w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Gestion du Stockage
            </h2>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('entree')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'entree'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Entrée
                </button>
                <button
                    onClick={() => setActiveTab('sortie')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'sortie'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    Sortie
                </button>
            </div>

            <div key={refreshKey}>
                {activeTab === 'entree' ? (
                    <StockageEntre onSuccess={handleSuccess} />
                ) : (
                    <StockageSortie onSuccess={handleSuccess} />
                )}
            </div>
        </div>
    );
}
