import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function PageLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setError("L'email est requis");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("L'email n'est pas valide");
            return false;
        }
        if (!formData.password) {
            setError("Le mot de passe est requis");
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8888/projet de stage/api/login.php', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data.status === 'success') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/fournisseurs');
            } else {
                setError(response.data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur de connexion au serveur. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-panel p-10">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Connexion
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Accédez à votre espace System Dattes
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Adresse Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Adresse email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Mot de passe</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                                } transition duration-150 ease-in-out shadow-lg transform hover:-translate-y-0.5`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </span>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
