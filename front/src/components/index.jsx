import React, { useState, useEffect } from 'react';
import { authService, apiService } from '../services/api';

const Index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [data, setData] = useState(null);

    // Vérifier si l'utilisateur est déjà authentifié au chargement
    useEffect(() => {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
            fetchProtectedData();
        }
    }, []);

    // Fonction de connexion
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await authService.login(email, password);
            
            if (result.success) {
                setSuccess(result.message);
                setIsAuthenticated(true);
                setEmail('');
                setPassword('');
                // Récupérer les données protégées après connexion
                await fetchProtectedData();
            } else {
                setError(result.message || 'Erreur de connexion');
            }
        } catch (error) {
            setError('Une erreur est survenue lors de la connexion');
            console.error('Erreur de connexion:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction de déconnexion
    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setData(null);
        setSuccess('Déconnexion réussie');
    };

    // Fonction pour récupérer les données protégées
    const fetchProtectedData = async () => {
        try {
            const result = await apiService.get('/api/data');
            
            if (result.ok && result.data.success) {
                setData(result.data.data);
            } else {
                setError(result.data.message || 'Erreur lors de la récupération des données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setError('Erreur lors de la récupération des données');
        }
    };

    // Si l'utilisateur est authentifié, afficher les données
    if (isAuthenticated) {
        return (
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>Bienvenue !</h1>
                
                {success && (
                    <div style={{ 
                        padding: '10px', 
                        backgroundColor: '#d4edda', 
                        color: '#155724', 
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }}>
                        {success}
                    </div>
                )}

                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}
                >
                    Déconnexion
                </button>

                <div>
                    <h2>Données protégées</h2>
                    <button 
                        onClick={fetchProtectedData}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        Actualiser les données
                    </button>
                    
                    {data ? (
                        <pre style={{ 
                            backgroundColor: '#f8f9fa', 
                            padding: '15px', 
                            borderRadius: '4px',
                            overflow: 'auto'
                        }}>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    ) : (
                        <p>Chargement des données...</p>
                    )}
                </div>
            </div>
        );
    }

    // Formulaire de connexion
    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '400px', 
            margin: '50px auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Connexion</h1>
            
            {error && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {success}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                    <label 
                        htmlFor="email" 
                        style={{ 
                            display: 'block', 
                            marginBottom: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        Email :
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="votre@email.com"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label 
                        htmlFor="password" 
                        style={{ 
                            display: 'block', 
                            marginBottom: '5px',
                            fontWeight: 'bold'
                        }}
                    >
                        Mot de passe :
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Votre mot de passe"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
};

export default Index;