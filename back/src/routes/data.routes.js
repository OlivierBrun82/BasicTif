const { Router } = require('express');
const dataController = require('../controllers/data.controller');
const authMiddleware = require('../middlewares/auth');

const router = Router();

// endpoints
// affiche toutes les données d'un utilisateur
router.get('/:id/all', authMiddleware, dataController.getAllData);
// affiche une donnée d'un utilisateur
router.get('/:id/data', authMiddleware, dataController.getData);

// export du routeur
module.exports = router;