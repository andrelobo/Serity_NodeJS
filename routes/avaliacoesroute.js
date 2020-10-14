
const avaliacoesroute = (app,postgress_manager, uploader) => {

    app.get('/professor/avaliacoes', (req, res) => {
        postgress_manager.avaliacao_select(req, res)
    })

    app.get('/professor/avaliacoes/adicionar', (req, res) => {
        postgress_manager.avaliacao_select2(req, res)
    })

    app.post('/professor/avaliacoes/adicionar', uploader.array('anexos'), (req, res) => {
        console.log(req.body)
        console.log(req.files)
        postgress_manager.avaliacao_select(req, res)
    })

    app.get('/aluno/avaliacoes', (req, res) => {
        res.render('contents/aluno/avaliacoes', {user: {name: req.session.name, nivel: req.session.nivel }, active: "avaliacoes"})
    })

}

module.exports = avaliacoesroute