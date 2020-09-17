
const homeroute = (app,postgress_manager) => {
    app.get('/home', (req, res) => {
        res.render('home', {user: {name: req.session.name, email: req.session.email, nivel: req.session.nivel }, active: "home"})
    })
}

module.exports = homeroute