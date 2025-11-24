// extrait router d'express
const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');

// crée le routeur
const router = Router();

//montage des sous routes
// route pour la création de compte et l'authentification
router.use('/auth', require('./auth.routes'));

// route pour les données
router.use('/data', authMiddleware, require('./data.routes'));

// export du routeur
module.exports = router;