
const homeroute = (app,postgress_manager) => {
    app.get('/relatorios', (req, res) => {
        res.render('relatorios', {user: {name: req.session.name, nivel: req.session.nivel }, active: "relatorios"})
    })
}

module.exports = homeroute