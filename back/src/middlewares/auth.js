// outil pour décoder et verifier les tokens
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // récupérer authorization dans le header de la requête
    const header = req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')){
        // si token manquant ou pas valide, renvoyer une erreur 401
        return res.status(401).json({
            success: false,
            message: 'token manquant',
            data: null
        });
    }

    // extraire la partie qui nous interesse
    // extraire le token APRES le Bearer
    const token = header.split(' ')[1];

    try {
        // vérifie le token et sa durée de vie
        const payload = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = payload;

        // laisse passer vers la route protégée
        return next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'token invalide',
            data: null
        });
        
    }
    
}