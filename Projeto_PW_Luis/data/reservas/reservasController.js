// controllers/reservasController.js

function reservasController(ReservaModel) {
    let controller = { 
        create, 
        findAll,
        findById,
        findByIdUser,
        update,
        removeById
    };

    function create(values) {
        let newReserva = new ReservaModel(values);
        return save(newReserva);
    }

    function save(newReserva) {
        return new Promise((resolve, reject) => {
            newReserva.save()
                .then(() => resolve('Reserva criada com sucesso'))
                .catch(err => reject(new Error('Erro ao criar reserva: ' + err.message)));
        });
    }

    function findAll() {
        return new Promise((resolve, reject) => {
            ReservaModel.find({})
                .populate('utilizador livro')
                .then((reservas) => resolve(reservas))
                .catch((err) => reject(err));
        });
    }

    function findById(id) {
        return new Promise((resolve, reject) => {
            ReservaModel.findById(id)
                .populate('utilizador livro')
                .then((reserva) => resolve(reserva))
                .catch((err) => reject(err));
        });
    }

    function findByIdUser(userId) {
        return new Promise((resolve, reject) => {
            ReservaModel.find({ utilizador: userId })
                .populate('utilizador livro')
                .then((reservas) => resolve(reservas))
                .catch((err) => reject(err));
        });
    }

    function update(id, values) {
        return new Promise((resolve, reject) => {
            ReservaModel.findByIdAndUpdate(id, values, { new: true, runValidators: true })
                .then((reserva) => resolve(reserva))
                .catch((err) => reject(err));
        });
    }

    function removeById(id) {
        return new Promise((resolve, reject) => {
            ReservaModel.findByIdAndDelete(id)
                .then(() => resolve('Reserva removida com sucesso'))
                .catch((err) => reject(err));
        });
    }

    return controller;
}

module.exports = reservasController;
