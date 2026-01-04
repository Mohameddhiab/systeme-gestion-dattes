import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AjoutFournisseur() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code_fournisseur: '',
        nom_complet: '',
        adresse: '',
        telephone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8888/projet de stage/api/fournisseur.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.data.status === 'success') {
                alert('Fournisseur ajouté avec succès !');
                navigate('/tablefournisseur');
            } else {
                setError(response.data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            if (error.response) {
                setError('Erreur serveur : ' + error.response.data.message);
            } else if (error.request) {
                setError('Erreur réseau : aucune réponse reçue');
            } else {
                setError('Erreur : ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-8 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Ajouter un Fournisseur
            </h2>

            {error && (
                <div className={`mb-6 p-4 rounded-lg flex items-center bg-red-50 text-red-700 border border-red-200`}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                        type="text"
                        name="nom_complet"
                        value={formData.nom_complet}
                        onChange={handleChange}
                        placeholder="Entrez le nom complet"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                        type="text"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleChange}
                        placeholder="Entrez l'adresse"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="Entrez le téléphone"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code du fournisseur</label>
                    <input
                        type="text"
                        name="code_fournisseur"
                        value={formData.code_fournisseur}
                        onChange={handleChange}
                        placeholder="Entrez le code fournisseur"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-150"
                        disabled={loading}
                    >
                        {loading ? "Traitement..." : "Valider"}
                    </button>
                </div>
            </form>
        </div>
    );
}
