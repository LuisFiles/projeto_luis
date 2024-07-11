const express = require('express');
const bodyParser = require('body-parser');
const livro = require("../data/livro/indexLivro"); // Certifique-se de que "../data/livro" esteja correto e contém o método "create"
const livroController = require("../data/livro/livroController"); // Certifique-se de que "../data/livro/livroController" esteja correto e contém os métodos "findByTitulo", "update" e "removeByTitulo"    
const authController = require("../data/user/authController"); // Certifique-se de que "../data/utilizador/authController" esteja correto e contém o método "createToken"
const utilizador = require("../data/user/indexAuth");
const utilizadorService = require('../data/user/authController');
const scopes = require("../data/user/scopes");

function livroRouter() {
    let router = express.Router();

    router.use(bodyParser.json({ limit: '100mb' }));
    router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

    router.use(function (req, res, next) {
        let token = req.headers["x-access-token"];
        if (!token) {
            return res
                .status(400)
                .send({ auth: false, message: "Token não fornecido." });
        }

        utilizador.verificaToken(token)
            .then((decoded) => {
                console.log("--> Valid Token <--");
                console.log("DECODED->", JSON.stringify(decoded, null, 2));
                req.roleUser = decoded.role;
                next();
            })
            .catch((err) => {  // Added err parameter to catch block
                console.error("Token verification failed: ", err.message); // Log the error for debugging
                res.status(401).send({ auth: false, message: "Nao tem autorizacao" });
            });
    });

    router.route('/livro')
        .get(utilizador.authorize([scopes["read-all"], scopes["read-posts"]]))
        .get((req, res) => {
            console.log('get');
            livro.findAll()
                .then((livro) => {
                    res.status(200).json(livro);
                })
                .catch((err) => {
                    console.error('Erro ao obter livro:', err.message);
                    res.status(500).json({ error: 'Erro ao obter livro', details: err.message });
                });
        })
        .post(utilizador.authorize([scopes["manage-posts"]]), async (req, res) => {
            console.log('post');
            let body = req.body;
            try {
                await livro.create(body);
                console.log('Livro criado');
                res.status(200).json(body);
            } catch (err) {
                console.log('Erro ao criar livro:', err.message);
                res.status(400).json({ error: 'Esse livro já existe' });
            }
        });

    router.route('/livro/:titulo')
        .get((req, res) => {
            console.log('get by title');
            let titulo = req.params.titulo;
            livro.findByTitulo(titulo)
                .then((livro) => {
                    if (livro) {
                        res.status(200).json(livro);
                    } else {
                        res.status(404).json({ error: 'Livro não encontrado' });
                    }
                })
                .catch((err) => {
                    console.error('Erro ao obter livro:', err.message);
                    res.status(500).json({ error: 'Erro ao obter livro', details: err.message });
                });
        })
        .put(async (req, res) => {
            console.log('put');
            let titulo = req.params.titulo;
            let body = req.body;

            try {
                const updatedLivro = await livro.update(titulo, body);
                console.log('Livro atualizado');
                res.status(200).json(updatedLivro);
            } catch (err) {
                console.log('Erro ao atualizar livro:', err.message);
                res.status(400).json({ error: 'Erro ao atualizar livro', details: err.message });
            }
        })
        .delete(async (req, res) => {
            console.log('delete');
            let titulo = req.params.titulo;

            try {
                await livro.removeByTitulo(titulo);
                console.log('Livro removido');
                res.status(200).json({ message: 'Livro removido' });
            } catch (err) {
                console.log('Erro ao remover livro:', err.message);
                res.status(400).json({ error: 'Erro ao remover livro', details: err.message });
            }
        });

    return router;
}

module.exports = livroRouter; // Exporta a função livroRouter() para ser usada em outro arquivo
