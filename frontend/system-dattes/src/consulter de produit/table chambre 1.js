import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function TableChambre1() {
    const [entreData, setEntreData] = useState([]);
    const [sortieData, setSortieData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8888/projet de stage/api/chambre1.php?search=${searchQuery}`);
            if (response.data.status === "success") {
                setEntreData(response.data.entre || []);
                setSortieData(response.data.sortie || []);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id, type) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet enregistrement ?")) {
            try {
                const response = await axios.delete(`http://localhost:8888/projet de stage/api/chambre1.php?id=${id}&type=${type}`);
                if (response.data.status === "success") {
                    fetchData();
                } else {
                    alert("Erreur: " + response.data.message);
                }
            } catch (err) {
                console.error("Erreur lors de la suppression");
                alert("Erreur lors de la suppression");
            }
        }
    };

    const TableHeader = () => (
        <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Lot N°</th>
                <th className="px-4 py-2 text-left">Catégorie</th>
                <th className="px-4 py-2 text-left text-center">PL</th>
                <th className="px-4 py-2 text-left text-center">LM</th>
                <th className="px-4 py-2 text-left text-center">GC</th>
                <th className="px-4 py-2 text-left">Poids (Kg)</th>
                <th className="px-4 py-2 text-center text-center">Actions</th>
            </tr>
        </thead>
    );

    const TableRow = ({ item, type }) => (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="px-4 py-2 text-sm text-gray-700">{item.date_stockage}</td>
            <td className="px-4 py-2 font-medium text-gray-900">{item.lot_number}</td>
            <td className="px-4 py-2 text-center text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {item.categorie}
                </span>
            </td>
            <td className="px-4 py-2 text-center text-sm">{item.pl}</td>
            <td className="px-4 py-2 text-center text-sm">{item.lm}</td>
            <td className="px-4 py-2 text-center text-sm">{item.gc}</td>
            <td className="px-4 py-2 font-semibold text-gray-800">{item.poids}</td>
            <td className="px-4 py-2 text-center">
                <button
                    onClick={() => handleDelete(item.id, type)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors shadow-sm"
                >
                    Supprimer
                </button>
            </td>
        </tr>
    );

    return (
        <div className="glass-panel p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Stock Chambre 1</h2>
                    <Link to="/consulter" className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1 mt-1 transition-colors">
                        ← Retour aux consultations
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Rechercher par lot..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                />
            </div>

            <div className="space-y-8">
                {/* Section Entrées */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-700">Entrées</h3>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Chargement...</div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                            <table className="min-w-full bg-white">
                                <TableHeader />
                                <tbody>
                                    {entreData.length > 0 ? (
                                        entreData.map((item, idx) => <TableRow key={`e-${idx}`} item={item} type="entre" />)
                                    ) : (
                                        <tr><td colSpan="8" className="text-center py-6 text-gray-500 italic">Aucune entrée trouvée</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Section Sorties */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-700">Sorties</h3>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Chargement...</div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                            <table className="min-w-full bg-white">
                                <TableHeader />
                                <tbody>
                                    {sortieData.length > 0 ? (
                                        sortieData.map((item, idx) => <TableRow key={`s-${idx}`} item={item} type="sortie" />)
                                    ) : (
                                        <tr><td colSpan="8" className="text-center py-6 text-gray-500 italic">Aucune sortie trouvée</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
