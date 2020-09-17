
const conteudosroute = (app,postgress_manager) => {
    app.get('/conteudos', (req, res) => {
        res.render('conteudos', {user: {name: req.session.name, email: req.session.email, nivel: req.session.nivel }, active: "conteudos"})
    })
}

module.exports = conteudosroute