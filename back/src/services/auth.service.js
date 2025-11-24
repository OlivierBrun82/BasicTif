const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const SALT_ROUNDS = 10;

// enregistrement d'un utilisateur
async function register(email, password) {
    // utiliser bcrypt pour hasher le mot de passe
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // créer un nouvel utilisateur
    return Users.create({ Email: email, Password: hash });
}

// validatio des données de connexion (credentials)
async function validateCredentials(email, password) {
    // vérification en db de l'existence de l'utilisateur
    const user = await Users.findOne({ where: { Email: email } });
    // si pas de compte on stop la fonction
    if (!user) return null;
    // vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.Password);
    // si comparaison ok, renvoi user sinon renvoi null
    return isValid ? user : null;
}

// génération d'un token JWT
function generateToken(user) {
    return jwt.sign(
        // les info minimal à envoyer au client (payload)
        {sub: user.id, role: user.role},
        process.env.JWT_TOKEN, // clée secrete pour "signer" le TOKEN
        { expiresIn: '3h'}
    )
}

module.exports = {generateToken, validateCredentials, register};