import React from 'react';

export default function PageSignUp() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full glass-panel p-10">
                <h2 className="text-3xl font-bold text-center mb-6">Inscription</h2>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nom complet"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg"
                    >
                        S'inscrire
                    </button>
                </form>
            </div>
        </div>
    );
}
