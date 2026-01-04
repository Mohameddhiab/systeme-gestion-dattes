import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function TableFumigation() {
    const [fumigations, setFumigations] = useState([]);

    useEffect(() => {
        fetchFumigations();
    }, []);

    const fetchFumigations = async () => {
        try {
            const response = await axios.get("http://localhost:8888/projet de stage/api/fum.php");
            setFumigations(response.data.fumigations || []);
        } catch (err) {
            console.error("Erreur");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8888/projet de stage/api/fum.php?id=${id}`);
            fetchFumigations();
        } catch (err) {
            console.error("Erreur");
        }
    };

    return (
        <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-4">Table des Fumigations</h2>
            <div className="mb-4">
                <Link to="/consulter" className="text-primary-600 hover:underline">← Retour</Link>
            </div>
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Code Produit</th>
                        <th className="px-4 py-2">N° Lot</th>
                        <th className="px-4 py-2">Quantité</th>
                        <th className="px-4 py-2">Date Début</th>
                        <th className="px-4 py-2">Date Fin</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fumigations.map((fum) => (
                        <tr key={fum.id} className="border-b">
                            <td className="px-4 py-2">{fum.code_produit}</td>
                            <td className="px-4 py-2">{fum.numero_lot}</td>
                            <td className="px-4 py-2">{fum.quantite_utilisee} Kg</td>
                            <td className="px-4 py-2">{fum.date_debut_fumigation}</td>
                            <td className="px-4 py-2">{fum.date_fin_fumigation}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleDelete(fum.id)} className="bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
