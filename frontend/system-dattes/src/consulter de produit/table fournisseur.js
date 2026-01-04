import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function TableFournisseur() {
    const [fournisseurs, setFournisseurs] = useState([]);

    useEffect(() => {
        fetchFournisseurs();
    }, []);

    const fetchFournisseurs = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8888/projet de stage/api/tabfourniseur.php`
            );
            if (response.data.status === "success") {
                setFournisseurs(response.data.fournisseurs);
            }
        } catch (err) {
            console.error("Erreur");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) {
            try {
                await axios.delete(
                    `http://localhost:8888/projet de stage/api/tabfourniseur.php?id=${id}`
                );
                fetchFournisseurs();
            } catch (err) {
                console.error("Erreur");
            }
        }
    };

    return (
        <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-4">Table des Fournisseurs</h2>
            <div className="mb-4">
                <Link to="/consulter" className="text-primary-600 hover:underline">← Retour</Link>
            </div>
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Code Fournisseur</th>
                        <th className="px-4 py-2">Nom Complet</th>
                        <th className="px-4 py-2">Adresse</th>
                        <th className="px-4 py-2">Téléphone</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fournisseurs.map((f) => (
                        <tr key={f.id} className="border-b">
                            <td className="px-4 py-2">{f.code_fournisseur}</td>
                            <td className="px-4 py-2">{f.nom_complet}</td>
                            <td className="px-4 py-2">{f.adresse}</td>
                            <td className="px-4 py-2">{f.telephone}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleDelete(f.id)} className="bg-red-500 text-white px-2 py-1 rounded">
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
