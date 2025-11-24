const authService = require('../services/auth.service');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    // récupère les erreurs générées par registerRules
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // stop si le payload est invalide
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // récupère les info et les enregistre en db
        const user = await authService.register(req.body.email, req.body.password);
        return res.status(201).json({ message: 'Utilisateur créé avec succès',
            data: {
                id: user.id,
                email: user.Email
            }
        });
    } catch (error) {
        // Afficher l'erreur dans la console pour le debug
        console.error('Erreur lors de l\'enregistrement:', error);
        
        if(error.name === 'SequelizeUniqueConstraintError'){
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé',
                data: null
            });
        }
        // Retourner l'erreur pour le debug (en développement)
        return res.status(500).json({
            success: false,
            message: 'erreur interne',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            data: null
        });
    }
}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    //stop si le payload est invalide
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    
    try {
        // utilise la fonction validateCredentials du service auth
        const user = await authService.validateCredentials(req.body.email, req.body.password);
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect',
                data: null
            });
        }

        const token = authService.generateToken(user);
        return res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            data: {token}
        });
    } catch (error) {
        // Afficher l'erreur dans la console pour le debug
        console.error('Erreur lors de la connexion:', error);
        
        return res.status(500).json({
            success: false,
            message: 'erreur interne',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            data: null
        });
    }
};