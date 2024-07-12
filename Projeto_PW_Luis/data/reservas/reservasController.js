
function reservasController(ReservaModel) {
    let controller = { 
        create, 
        findAll,
        findById,
        findByIdUser,
        findByIdUserAndStatus,
        update,
        removeById
    };

    function create(values) {
        return new Promise((resolve, reject) => {
            const maxReservaPeriod = 15 * 24 * 60 * 60 * 1000; // 15 dias em milissegundos
            const dataReserva = values.dataReserva ? new Date(values.dataReserva) : new Date();
            const dataVencimento = new Date(values.dataVencimento);

            if (dataVencimento - dataReserva > maxReservaPeriod) {
                return reject(new Error('O período máximo de reserva é de 15 dias.'));
            }

            ReservaModel.countDocuments({ utilizador: values.utilizador, status: 'reservado' })
                .then(count => {
                    if (count >= 3) {
                        return reject(new Error('O utilizador já reservou o máximo de 3 livros.'));
                    }

                    let newReserva = new ReservaModel(values);
                    return save(newReserva).then(resolve).catch(reject);
                })
                .catch(err => reject(new Error('Erro ao verificar reservas do utilizador: ' + err.message)));
        });
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

    function findByIdUserAndStatus(userId, status) {
        return new Promise((resolve, reject) => {
            ReservaModel.find({ utilizador: userId, status: status })
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
