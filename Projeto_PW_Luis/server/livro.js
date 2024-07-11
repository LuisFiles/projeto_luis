const express = require('express');
const bodyParser = require('body-parser');
const Livro = require("../data/livro/livro"); // Certifique-se de que o caminho está correto
const livroController = require("../data/livro/livroController")(Livro); // Certifique-se de que o caminho está correto
const authController = require("../data/user/authController"); // Certifique-se de que o caminho está correto
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
            .catch((err) => {
                console.error("Token verification failed: ", err.message);
                res.status(401).send({ auth: false, message: "Nao tem autorizacao" });
            });
    });

    router.route('/livro')
        .get(utilizador.authorize([scopes["read-all"], scopes["read-posts"]]))
        .get((req, res) => {
            console.log('get');
            livroController.findAll()
                .then((livros) => {
                    res.status(200).json(livros);
                })
                .catch((err) => {
                    console.error('Erro ao obter livros:', err.message);
                    res.status(500).json({ error: 'Erro ao obter livros', details: err.message });
                });
        })
        .post(utilizador.authorize([scopes["manage-posts"]]), async (req, res) => {
            console.log('post');
            let body = req.body;
            try {
                await livroController.create(body);
                console.log('Livro criado');
                res.status(200).json(body);
            } catch (err) {
                console.log('Erro ao criar livro:', err.message);
                res.status(400).json({ error: 'Erro ao criar livro', details: err.message });
            }
        });

    router.route('/livro/titulo/:titulo')
        .get((req, res) => {
            console.log('get by title');
            let titulo = req.params.titulo;
            livroController.findByTitulo(titulo)
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
                const updatedLivro = await livroController.update(titulo, body);
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
                await livroController.removeByTitulo(titulo);
                console.log('Livro removido');
                res.status(200).json({ message: 'Livro removido' });
            } catch (err) {
                console.log('Erro ao remover livro:', err.message);
                res.status(400).json({ error: 'Erro ao remover livro', details: err.message });
            }
        });

    router.route('/livro/categoria/:categoria')
        .get((req, res) => {
            console.log('get by category');
            let categoria = req.params.categoria;
            livroController.findByCategoria(categoria)
                .then((livros) => {
                    if (livros.length > 0) {
                        res.status(200).json(livros);
                    } else {
                        res.status(404).json({ error: 'Nenhum livro encontrado para esta categoria' });
                    }
                })
                .catch((err) => {
                    console.error('Erro ao obter livros por categoria:', err.message);
                    res.status(500).json({ error: 'Erro ao obter livros', details: err.message });
                });
        });

    router.route('/livro/autor/:autor')
        .get((req, res) => {
            console.log('get by author');
            let autor = req.params.autor;
            livroController.findByAutor(autor)
                .then((livros) => {
                    if (livros.length > 0) {
                        res.status(200).json(livros);
                    } else {
                        res.status(404).json({ error: 'Nenhum livro encontrado para este autor' });
                    }
                })
                .catch((err) => {
                    console.error('Erro ao obter livros por autor:', err.message);
                    res.status(500).json({ error: 'Erro ao obter livros', details: err.message });
                });
        });

    return router;
}

module.exports = livroRouter;
