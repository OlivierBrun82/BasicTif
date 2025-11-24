const { body } = require('express-validator');

// validation des données de création de compte
exports.registerRules = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Mot de passe trop court'),
];

// validation des données de connexion
exports.loginRules = [
    body('email').isEmail(),
    body('password').notEmpty()
];