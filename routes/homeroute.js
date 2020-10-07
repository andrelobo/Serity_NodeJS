
const homeroute = (app,postgress_manager) => {
    app.get('/home', (req, res) => {
        res.render('home', {user: {name: req.session.name, nivel: req.session.nivel, codigo: req.session.codigo}, active: "home"})
    })
}

module.exports = homeroute