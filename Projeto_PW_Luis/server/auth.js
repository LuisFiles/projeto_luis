const express = require('express');
const bodyParser = require('body-parser');
const utilizadorModel = require('../data/user/utilizador'); // Certifique-se de que este é o caminho correto para o modelo de utilizador
const utilizadorService = require('../data/user/authController')(utilizadorModel);

function authRouter() {
    const router = express.Router();

    router.use(bodyParser.json({ limit: '100mb' }));
    router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

    router.route('/registo').post(async (req, res, next) => {
        const body = req.body;
        console.log('Utilizador: ', body);

        try {
            const utilizador = await utilizadorService.create(body);
            const tokenResponse = utilizadorService.criarToken(utilizador);
            res.status(200).json(tokenResponse);
        } catch (err) {
            res.status(500).json({ error: err.message });
            next(err);
        }
    });

    router.route('/me').get(async (req, res, next) => {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({ auth: false, message: 'Token não fornecido1.' });
        }

        try {
            const decoded = await utilizadorService.verificaToken(token);
            res.status(200).json(decoded);
        } catch (err) {
            res.status(500).json({ auth: false, message: 'Falha na autenticação do token.' });
            next(err);
        }
    });

    router.route("/login").post(async (req, res, next) => { 
        let body = req.body;
        console.log("Login para utilizador: ", body);   
        return utilizadorService.findUtilizador(body)   
        .then((user) => {
            return utilizadorService.criarToken(user);
        })
        .then((response) => {
            res.status(200);
            res.send(response);
            console.log(response);
        })
        .catch((err) => {
            res.status(500);
            res.send(err);
            next();
         });
    });
    return router;
}

module.exports = authRouter;
