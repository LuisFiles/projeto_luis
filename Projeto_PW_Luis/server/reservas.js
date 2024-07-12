// routes/reservaRoutes.js

const express = require('express');
const bodyParser = require('body-parser');
const Reserva = require('../data/reservas/reservas'); 
const reservasController = require('../data/reservas/reservasController')(Reserva);
const authController = require('../data/user/authController'); 
const utilizador = require('../data/user/indexAuth'); 
const scopes = require('../data/user/scopes');

function reservaRouter() {
    let router = express.Router();

    router.use(bodyParser.json({ limit: '100mb' }));
    router.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

    router.use(function (req, res, next) {
        let token = req.headers['x-access-token'];
        if (!token) {
            return res
                .status(400)
                .send({ auth: false, message: 'Token não fornecido3.' });
        }

        utilizador.verificaToken(token)
            .then((decoded) => {
                console.log('--> Valid Token <--');
                console.log('DECODED->', JSON.stringify(decoded, null, 2));
                req.roleUser = decoded.role;
                next();
            })
            .catch((err) => {
                console.error('Token verification failed: ', err.message);
                res.status(401).send({ auth: false, message: 'Nao tem autorizacao' });
            });
    });

    router.route('/reserva')
        .get(utilizador.authorize([scopes["admin"], scopes["user"]]),(req, res) => {
            console.log('get');
            reservasController.findAll()
                .then((reservas) => {
                    res.status(200).json(reservas);
                })
                .catch((err) => {
                    console.error('Erro ao obter reservas:', err.message);
                    res.status(500).json({ error: 'Erro ao obter reservas', details: err.message });
                });
        })
        .post(utilizador.authorize([scopes["admin"], scopes["user"]]), async (req, res) => {
            console.log('post');
            let body = req.body;
            try {
                await reservasController.create(body);
                console.log('Reserva criada');
                res.status(200).json(body);
            } catch (err) {
                console.log('Erro ao criar reserva:', err.message);
                res.status(400).json({ error: 'Erro ao criar reserva', details: err.message });
            }
        });


    router.route('/reserva/user/:userId')
        .get(utilizador.authorize([scopes["admin"], scopes["user"]]),(req, res) => {
            console.log('get by user id');
            let userId = req.params.userId;
            reservasController.findByIdUser(userId)
                .then((reservas) => {
                    res.status(200).json(reservas);
                })
                .catch((err) => {
                    console.error('Erro ao obter reservas por ID do utilizador:', err.message);
                    res.status(500).json({ error: 'Erro ao obter reservas', details: err.message });
                });
        });

    router.route('/reserva/user/reservado/:userId')
        .get(utilizador.authorize([scopes["admin"], scopes["user"]]) ,(req, res) => {
            console.log('get by user id with status reservado');
            let userId = req.params.userId;
            reservasController.findByIdUserAndStatus(userId, 'reservado')
                .then((reservas) => {
                    if (reservas.length > 0) {
                        res.status(200).json(reservas);
                    } else {
                        res.status(404).json({ error: 'Nenhuma reserva encontrada com status reservado para este utilizador' });
                    }
                })
                .catch((err) => {
                    console.error('Erro ao obter reservas com status reservado por ID do utilizador:', err.message);
                    res.status(500).json({ error: 'Erro ao obter reservas', details: err.message });
                });
        });

    router.route('/reserva/:id')
        .get(utilizador.authorize([scopes["admin"], scopes["user"]]) ,(req, res) => {
            console.log('get by id');
            let id = req.params.id;
            reservasController.findById(id)
                .then((reserva) => {
                    if (reserva) {
                        res.status(200).json(reserva);
                    } else {
                        res.status(404).json({ error: 'Reserva não encontrada' });
                    }
                })
                .catch((err) => {
                    console.error('Erro ao obter reserva:', err.message);
                    res.status(500).json({ error: 'Erro ao obter reserva', details: err.message });
                });
        })
        .put(utilizador.authorize([scopes["user"]]) ,async (req, res) => {
            console.log('put');
            let id = req.params.id;
            let body = req.body;

            try {
                const updatedReserva = await reservasController.update(id, body);
                console.log('Reserva atualizada');
                res.status(200).json(updatedReserva);
            } catch (err) {
                console.log('Erro ao atualizar reserva:', err.message);
                res.status(400).json({ error: 'Erro ao atualizar reserva', details: err.message });
            }
        })
        .delete (utilizador.authorize([scopes["user"]]) ,async (req, res) => {
            console.log('delete');
            let id = req.params.id;

            try {
                await reservasController.removeById(id);
                console.log('Reserva removida');
                res.status(200).json({ message: 'Reserva removida' });
            } catch (err) {
                console.log('Erro ao remover reserva:', err.message);
                res.status(400).json({ error: 'Erro ao remover reserva', details: err.message });
            }
        });

    return router;
}

module.exports = reservaRouter;
