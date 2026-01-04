import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AjouterProduit() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code_fournisseur: '',
        type_produit: '',
        date_reception: '',
        quantite: '',
        code_produit: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8888/projet de stage/api/produits.php', formData);
            if (response.data.status === 'success') {
                setMessage('Produit ajouté avec succès !');
                setFormData({ code_fournisseur: '', type_produit: '', date_reception: '', quantite: '', code_produit: '' });
                navigate('/tableproduit');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('Erreur lors de l\'ajout du produit');
        }
    };

    return (
        <div className="glass-panel p-8 w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                Ajouter un Produit
            </h2>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('succès') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Fournisseur</label>
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

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de Produit</label>
                    <select
                        name="type_produit"
                        value={formData.type_produit}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    >
                        <option value="">Sélectionnez le type</option>
                        <option value="Deglet Nour">Deglet Nour</option>
                        <option value="Allig">Allig</option>
                        <option value="Kenta">Kenta</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de Réception</label>
                    <input
                        type="date"
                        name="date_reception"
                        value={formData.date_reception}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (Kg)</label>
                    <input
                        type="number"
                        name="quantite"
                        value={formData.quantite}
                        onChange={handleChange}
                        placeholder="Entrez la quantité"
                        min="0"
                        step="0.1"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Produit</label>
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

                <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-150"
                    >
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    );
}
