// controller.js

const { check, validationResult } = require('express-validator');
const { usuarios } = require('./model');

// Middleware array contendo as validação dos campos do formulário
const validateFormFields = [
    check('usuario').notEmpty().withMessage('Usuário é obrigatório'),
    check('senha').notEmpty().withMessage('Senha é obrigatória')
];

// Função para autenticar o usuário
const authenticateUser = (req, res) => { 
    const errors = validationResult(req); 
    if (!errors.isEmpty()) { //Se errors não estiver vazio, significa que houve falha na validação.
        return res.status(400).send(errors.array()[0].msg);
    }

    const { usuario, senha } = req.body;
    if (usuarios[usuario] === senha) {  //verifica se a combinação usuário/senha fornecida pelo cliente está correta ao objeto usuarios
        res.cookie('usuario', usuario); // Cria um cookie para armazenar o usuário
        res.redirect('/pagina_usuario');
    } else {
        res.send('Credenciais inválidas. Tente novamente.');
    }
};

// Função para logout
const logoutUser = (req, res) => {
    res.clearCookie('usuario'); // Apaga o cookie do usuário
    res.redirect('/');
};

// Função para exibir informações do usuário
const displayUserInfo = (req, res) => {
    const usuario = req.cookies.usuario; //extrai o valor do cookie chamado usuario
    const senha = usuarios[usuario]; // Obtendo a senha do usuário, Usa o valor do usuário obtido do cookie para procurar no objeto usuarios a senha correspondente ao usuário.
    if (usuario && senha) {
        res.render('informacoes_usuario', { usuario, senha });
    } else {
        res.redirect('/');
    }
};

function renderPaginaUsuario(req, res) {
    const usuario = req.cookies.usuario; //extrai o valor do cookie chamado 'usuario' da requisição
    if (usuario) { // verifica se o cookie 'usuario' está definido. 
        res.render('pagina_usuario', { usuario });
    } else {
        res.redirect('/');
    }
}

module.exports = { validateFormFields, authenticateUser, logoutUser, displayUserInfo, renderPaginaUsuario };
