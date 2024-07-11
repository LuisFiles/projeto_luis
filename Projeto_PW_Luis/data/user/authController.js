const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../config');
const utilizadorModel = require('./utilizador');

function utilizadorService() {
    const service = {
        create,
        criarToken,
        verificaToken,
        findUtilizador,
        authorize
    };

    async function create(utilizador) {
        try {
            const hashPassword = await criarPassword(utilizador.password);
            const novoUtilizadorComPassword = {
                ...utilizador,
                password: hashPassword,
            };
            const novoUtilizador = new utilizadorModel(novoUtilizadorComPassword);
            return await save(novoUtilizador);
        } catch (err) {
            return { success: false, message: "Nao guardado", error: err.message };
        }
    }

    function save(novoUtilizador) {
        return novoUtilizador.save()
            .then(utilizador => ({ success: true, user: utilizador }))
            .catch(err => Promise.reject(new Error('Erro ao criar utilizador: ' + err.message)));
    }

    function criarToken(utilizador) {
        let roleScope = (utilizador.role && utilizador.role.scopes) ? utilizador.role.scopes : [];
        let token = jwt.sign(
            { id: utilizador._id, name: utilizador.name, role: { scopes: roleScope } },
            config.secret,
            { expiresIn: config.expiresPassword }
        );
        return { auth: true, token };
    }

    function verificaToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) return reject(new Error('Falha na autenticação do token.'));
                resolve(decoded);
            });
        });
    }

    function findUtilizador({ nome, password }) {
        return utilizadorModel.findOne({ nome })
            .then(utilizador => {
                if (!utilizador) return Promise.reject('Utilizador não encontrado');
                return comparaPassword(password, utilizador.password)
                    .then(match => {
                        if (!match) return Promise.reject('Password errada');
                        return utilizador;
                    });
            })
            .catch(err => Promise.reject(`Ha um problema com o login: ${err.message}`));
    }

    function criarPassword(password) {
        return bcrypt.hash(password, config.saltRounds);
    }

    function comparaPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    function authorize(scopes) {
        return (request, response, next) => {
            const { roleUser } = request;
            console.log("Route scopes: ", scopes);
            console.log("roleUser: ", roleUser); // Log the entire roleUser object to validate its contents

            if (!roleUser || !roleUser.scopes) {
                return response.status(401).json({ message: "Nao tem autorizacao" });
            }

            const hasAuthorization = scopes.some((scopes) => roleUser.scopes.includes(scopes));

            if (hasAuthorization) {
                next();
            } else {
                response.status(401).json({ message: "Forbidden" });
            }
        };
    }

    return service;
}

module.exports = utilizadorService;
