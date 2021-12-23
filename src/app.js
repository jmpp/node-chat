const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = 1337;

/**
 * Configuration du moteur de template
 */

app.set('view engine', 'pug');
app.set('views', './src/views');

app.locals.pretty = true; // Utile si on veut debugguer le code HTML généré côté client

require('./chat-serveur')(io);

/**
 * Middlewares (fonctions intermediaires) de l'application Express
 */

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.static('./src/static'));

/**
 * Routes de l'application Express
 */

app.get('/', (req, res) => {
    res.render('index');
});

// Route qui va écouter sur http://localhost:1337/chat
app.get('/chat', (req, res) => {
    // Un paramètre pseudo est obligatoire pour accéder à cette route:
    if (!req.query.pseudo) {
        return res.redirect('/'); // Redirige vers la page de login
    }

    const pseudo = req.query.pseudo;
    
    res.render('chat', { pseudo });
});


// L'application Express va écouter et répondre sur le port réseau n°1337
server.listen(PORT, () => console.log('Le serveur écoute sur http://localhost:' + PORT));