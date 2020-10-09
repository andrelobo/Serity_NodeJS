
const trabalhosroute = (app,postgress_manager) => {
    app.get('/trabalhos', (req, res) => {
        res.render('trabalhos', {user: {name: req.session.name, nivel: req.session.nivel }, active: "trabalhos"})
    })
}

module.exports = trabalhosroute