
const avaliacoesroute = (app,postgress_manager) => {
    app.get('/avaliacoes', (req, res) => {
        res.render('avaliacoes', {user: {name: req.session.name, nivel: req.session.nivel }, active: "avaliacoes"})
    })
}

module.exports = avaliacoesroute