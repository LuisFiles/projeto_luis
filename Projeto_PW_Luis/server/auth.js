const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const utilizadorModel = require('../data/user/utilizador'); // Certifique-se de que este é o caminho correto para o modelo de utilizador
const utilizadorService = require('../data/user/authController')(utilizadorModel);

function authRouter() {
    const router = express.Router();

    router.use(bodyParser.json({ limit: '100mb' }));
    router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
    router.use(cookieParser()); // Use cookie-parser middleware

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
        // Use cookie for token if available
        const token = req.headers['x-access-token'] || req.cookies.token; 
        if (!token) {
            return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
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
        const body = req.body;
        console.log("Login para utilizador: ", body);   
        
        try {
            const user = await utilizadorService.findUtilizador(body);
            const response = await utilizadorService.criarToken(user);
            res.cookie('token', response.token, { httpOnly: true }); // Set token as httpOnly cookie
            res.status(200).json(response);
            console.log(response);
        } catch (err) {
            res.status(500).json({ error: err.message });
            next(err);
        }
    });

    router.get('/logout', (req, res) => {
        res.cookie('token', '', { httpOnly: true, maxAge: 0 });
        res.status(200).send({ logout: true });
    });

    return router;
}

module.exports = authRouter;
