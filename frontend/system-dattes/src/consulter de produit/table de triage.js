import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TableTriage() {
    const [triages, setTriages] = useState([]);

    useEffect(() => {
        fetchTriages();
    }, []);

    const fetchTriages = async () => {
        try {
            const response = await axios.get(`http://localhost:8888/projet de stage/api/tri.php`);
            if (response.data.status === 'success') {
                setTriages(response.data.triages);
            }
        } catch (err) {
            console.error('Erreur');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce triage ?")) {
            try {
                await axios.delete(`http://localhost:8888/projet de stage/api/tri.php?id=${id}`);
                fetchTriages();
            } catch (err) {
                console.error('Erreur');
            }
        }
    };

    return (
        <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-4">Table de Triage</h2>
            <div className="mb-4">
                <Link to="/consulter" className="text-primary-600 hover:underline">← Retour</Link>
            </div>
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Code produit</th>
                        <th className="px-4 py-2">Date de triage</th>
                        <th className="px-4 py-2">Quantité utilisée (Kg)</th>
                        <th className="px-4 py-2">Quantité produit fini (Kg)</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {triages.map((triage) => (
                        <tr key={triage.id} className="border-b">
                            <td className="px-4 py-2">{triage.code_produit}</td>
                            <td className="px-4 py-2">{triage.date_triage}</td>
                            <td className="px-4 py-2">{triage.quantite_utilisee}</td>
                            <td className="px-4 py-2">{triage.quantite_produit_fini}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleDelete(triage.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
