import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TableProduit() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8888/projet de stage/api/product.php");
            setProducts(response.data.products || []);
        } catch (err) {
            console.error("Erreur lors du chargement des données");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8888/projet de stage/api/product.php?id=${id}`);
            fetchProducts();
        } catch (err) {
            console.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Table des Produits</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Rechercher par code produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Code Fournisseur</th>
                            <th className="px-4 py-2 text-left">Type Produit</th>
                            <th className="px-4 py-2 text-left">Date Réception</th>
                            <th className="px-4 py-2 text-left">Quantité</th>
                            <th className="px-4 py-2 text-left">Code Produit</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{product.code_fournisseur}</td>
                                    <td className="px-4 py-2">{product.type_produit}</td>
                                    <td className="px-4 py-2">{product.date_reception}</td>
                                    <td className="px-4 py-2">{product.quantite}</td>
                                    <td className="px-4 py-2">{product.code_produit}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    Aucun produit trouvé
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
