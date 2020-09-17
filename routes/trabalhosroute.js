
const trabalhosroute = (app,postgress_manager) => {
    app.get('/trabalhos', (req, res) => {
        res.render('trabalhos', {user: {name: req.session.name, email: req.session.email, nivel: req.session.nivel }, active: "trabalhos"})
    })
}

module.exports = trabalhosroute