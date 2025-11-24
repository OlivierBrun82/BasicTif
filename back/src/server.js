//charge les variables d'environnement de .env
require('dotenv').config();

const app = require('./app');

//recupère le PORT
const PORT = process.env.PORT;

//Vérifie que le portexiste
if(!PORT){
    console.log('PORT absent veuillez completer le fichier .env');
    //stop le programme de lancement de node
    process.exit(1);
}

app.listen(PORT, ()=>{
    console.log(`server lancé sur le port ${PORT}`);
});