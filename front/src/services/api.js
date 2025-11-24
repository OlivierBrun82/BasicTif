// Configuration de l'URL de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Récupère le token depuis le localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Stocke le token dans le localStorage
 */
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

/**
 * Effectue une requête HTTP avec gestion automatique du token
 */
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Ajouter le token si disponible
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    // Si le token est invalide, le supprimer
    if (response.status === 401) {
      setToken(null);
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: { success: false, message: 'Erreur réseau', error: error.message },
    };
  }
};

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion d'un utilisateur
   */
  login: async (email, password) => {
    const result = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.ok && result.data.success && result.data.data?.token) {
      setToken(result.data.data.token);
      return {
        success: true,
        message: result.data.message,
      };
    }

    return {
      success: false,
      message: result.data.message || 'Erreur de connexion',
      errors: result.data.errors,
    };
  },

  /**
   * Inscription d'un nouvel utilisateur
   */
  register: async (email, password) => {
    const result = await fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.ok) {
      return {
        success: true,
        message: result.data.message || 'Utilisateur créé avec succès',
      };
    }

    return {
      success: false,
      message: result.data.message || 'Erreur lors de l\'inscription',
      errors: result.data.errors,
    };
  },

  /**
   * Déconnexion
   */
  logout: () => {
    setToken(null);
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated: () => {
    return !!getToken();
  },

  /**
   * Récupère le token actuel
   */
  getToken,
};

/**
 * Service pour les requêtes authentifiées
 */
export const apiService = {
  /**
   * Effectue une requête GET authentifiée
   */
  get: async (endpoint) => {
    return fetchAPI(endpoint, { method: 'GET' });
  },

  /**
   * Effectue une requête POST authentifiée
   */
  post: async (endpoint, body) => {
    return fetchAPI(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Effectue une requête PUT authentifiée
   */
  put: async (endpoint, body) => {
    return fetchAPI(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Effectue une requête DELETE authentifiée
   */
  delete: async (endpoint) => {
    return fetchAPI(endpoint, { method: 'DELETE' });
  },
};

