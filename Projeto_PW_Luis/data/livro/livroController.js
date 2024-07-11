function livroController(livroModel) {

    let controller = { 
        create, 
        findAll,
        findByTitulo,
        update,
        removeByTitulo
     };

    function create(values) {
        let newLivro = new livroModel(values);
        return save(newLivro);
    }

    function save(newLivro) {
        return new Promise((resolve, reject) => {
            newLivro.save()
                .then(() => resolve('Livro criado'))
                .catch(err => reject(new Error('Erro ao criar livro: ' + err.message)));
        });
    }

    function findAll(){
        return new Promise((resolve, reject) => {
            livroModel.find({})
                .then((livro) => resolve(livro))
                .catch((err) => reject(err));
        });
    }

    function findByTitulo(titulo){
        return new Promise((resolve, reject) => {
            livroModel.findOne({ titulo: titulo })
            .then((livro) => resolve(livro))
            .catch((err) => reject(err));
        });
    }

   function update(titulo, values) {
        return new Promise((resolve, reject) => {
            livroModel.updateOne({ titulo: titulo }, values)
                .then((livro) => resolve(livro))
                .catch((err) => reject(err));
        });
    }

    function removeByTitulo(titulo) {
        return new Promise((resolve, reject) => {
            livroModel.deleteOne({ titulo: titulo })
                .then(() => resolve('Livro removido'))
                .catch((err) => reject(err));
        });
    }

    return controller;
}

module.exports = livroController;
