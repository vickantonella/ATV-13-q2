// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { check } = require('express-validator');
const { validateFormFields, authenticateUser, logoutUser, displayUserInfo } = require('./controller');
const { renderPaginaUsuario } = require('./controller');

const app = express();
const port = 3000;

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware para analisar os corpos das requisições
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware para analisar cookies
app.use(cookieParser());

// Rota para página index
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para autenticar o usuário
app.post('/auth', validateFormFields, (req, res) => { 
    authenticateUser(req, res);
});

// Rota para página de usuarios
app.get('/pagina_usuario', renderPaginaUsuario);

// Rota para logout
app.get('/logout', (req, res) => {
    logoutUser(req, res);
});

// Rota para exibir informações do usuário
app.get('/informacoes_usuario', (req, res) => {
    displayUserInfo(req, res);
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
