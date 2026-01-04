import React, { useState } from 'react';
import axios from 'axios';

export default function StockageSortie({ onSuccess }) {
    const [formData, setFormData] = useState({
        date_stockage: '',
        lot_number: '',
        categorie: '',
        pl: '',
        lm: '',
        gc: '',
        poids: '',
        numero_chambre: '1'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Préparer les données avec les paramètres requis par le backend
            const chambreMapping = {
                '1': 'chambre 1',
                '2': 'chambre 2',
                '3': 'chambre 3'
            };

            const dataToSend = {
                ...formData,
                operation: 'sortie',
                chambre: chambreMapping[formData.numero_chambre]
            };

            console.log('Envoi des données:', dataToSend);

            const response = await axios.post('http://localhost:8888/projet de stage/api/stockagesortie.php', dataToSend);

            console.log('Réponse du serveur:', response.data);

            if (response.data.status === 'success') {
                alert(response.data.message || 'Sortie enregistrée avec succès !');
                setFormData({
                    date_stockage: '',
                    lot_number: '',
                    categorie: '',
                    pl: '',
                    lm: '',
                    gc: '',
                    poids: '',
                    numero_chambre: '1'
                });
                if (onSuccess) onSuccess();
            } else {
                alert('Erreur: ' + (response.data.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            if (error.response) {
                alert('Erreur serveur: ' + (error.response.data.message || error.response.statusText));
            } else if (error.request) {
                alert('Erreur: Impossible de contacter le serveur. Vérifiez que MAMP est démarré.');
            } else {
                alert('Erreur lors de l\'enregistrement: ' + error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                    type="date"
                    name="date_stockage"
                    value={formData.date_stockage}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot N°</label>
                <input
                    type="text"
                    name="lot_number"
                    value={formData.lot_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Sélectionner</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PL</label>
                <input
                    type="number"
                    name="pl"
                    value={formData.pl}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LM</label>
                <input
                    type="number"
                    name="lm"
                    value={formData.lm}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GC</label>
                <input
                    type="number"
                    name="gc"
                    value={formData.gc}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poids (Kg)</label>
                <input
                    type="number"
                    name="poids"
                    value={formData.poids}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chambre N°</label>
                <select
                    name="numero_chambre"
                    value={formData.numero_chambre}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="1">Chambre 1</option>
                    <option value="2">Chambre 2</option>
                    <option value="3">Chambre 3</option>
                </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-lg"
                >
                    Enregistrer la sortie
                </button>
            </div>
        </form>
    );
}
