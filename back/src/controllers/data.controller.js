const db = require('../models');
const Data = db.Data;

function parseId(params) {
    const id = Number(params.id);
    if(!Number.isInteger(id) || id <= 0) {
        return null
    }
    return id;
}

// affiche toute les données d'un utilisateur
exports.getAllData = async (req, res) => {
    const userId = parseId(req.params);
    if(!userId) {
        return res.status(400).json({ message: 'ID invalide' });
    }
    try {
        const data = await Data.findAll({ where: { userId } });
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération des données' });
    }
}

// affiche une donnée d'un utilisateur
exports.getData = async (req, res) => {
    const userId = parseId(req.params);
    if(!userId) {
        return res.status(400).json({ message: 'ID invalide' });
    }
    try {
        const data = await Data.findOne({ where: { userId } });
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la récupération de la donnée' });
    }
}