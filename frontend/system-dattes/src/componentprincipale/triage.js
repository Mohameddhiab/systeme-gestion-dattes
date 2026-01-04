import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Triage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code_produit: '',
        date_triage: '',
        quantite_utilisee: '',
        quantite_produit_fini: '',
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

    const validateForm = () => {
        if (!formData.code_produit.trim()) return "Le code de produit est requis";
        if (!formData.date_triage) return "La date de triage est requise";
        if (!formData.quantite_utilisee || formData.quantite_utilisee <= 0) return "La quantité utilisée doit être un nombre positif";
        if (!formData.quantite_produit_fini || formData.quantite_produit_fini <= 0) return "La quantité de produit fini doit être un nombre positif";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8888/projet de stage/api/triage.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.status === 'success') {
                alert('Triage ajouté avec succès !');
                navigate('/tabletriage');
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
                Phase de Triage
            </h2>

            {error && (
                <div className={`mb-6 p-4 rounded-lg flex items-center bg-red-50 text-red-700 border border-red-200`}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de triage</label>
                    <input
                        type="date"
                        name="date_triage"
                        value={formData.date_triage}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code de produit</label>
                    <input
                        type="text"
                        name="code_produit"
                        value={formData.code_produit}
                        onChange={handleChange}
                        placeholder="Entrez le code produit"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité utilisée (Kg)</label>
                    <input
                        type="number"
                        name="quantite_utilisee"
                        value={formData.quantite_utilisee}
                        onChange={handleChange}
                        placeholder="Entrez la quantité utilisée"
                        min="0.1"
                        step="0.1"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité produit fini (Kg)</label>
                    <input
                        type="number"
                        name="quantite_produit_fini"
                        value={formData.quantite_produit_fini}
                        onChange={handleChange}
                        placeholder="Entrez la quantité de produit fini"
                        min="0.1"
                        step="0.1"
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
