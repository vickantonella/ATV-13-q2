const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// Dados de usuário (poderiam estar em um banco de dados)
const usuarios = {
    'usuario1': 'senha1',
    'usuario2': 'senha2',
    'victoria': '12345'
};

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

// Middleware para validação dos campos do formulário
const validateFormFields = [
    check('usuario').notEmpty().withMessage('Usuário e senha são obrigatórios.'),
    check('senha').notEmpty().withMessage('Usuário e senha são obrigatórios.')
];

// Rota para autenticar o usuário
app.post('/auth', validateFormFields, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array()[0].msg);
    }
    
    const { usuario, senha } = req.body;
    if (usuarios[usuario] === senha) {
        res.cookie('usuario', usuario); // Cria um cookie para armazenar o usuário
        res.redirect('/pagina_usuario');
    } else {
        res.send('Credenciais inválidas. Tente novamente.');
    }
});

// Rota para página de usuários
app.get('/pagina_usuario', (req, res) => {
    const usuario = req.cookies.usuario;

    if (usuario) {
        res.render('pagina_usuario', { usuario });
    } else {
        res.redirect('/');
    }
});

// Rota para logout
app.get('/logout', (req, res) => {
    res.clearCookie('usuario'); // Apaga o cookie do usuário
    res.redirect('/');
});

// Rota para exibir informações do usuário
app.get('/informacoes_usuario', (req, res) => {
    const usuario = req.cookies.usuario;
    const senha = usuarios[usuario]; // Obtendo a senha do usuário

    if (usuario && senha) {
        res.render('informacoes_usuario', { usuario, senha });
    } else {
        res.redirect('/');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
