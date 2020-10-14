
const homeroute = (app,postgress_manager) => {
    app.get('/home', (req, res) => {
        var metadata = {
            user: {
                name: req.session.name, 
                nivel: req.session.nivel, 
                codigo: req.session.codigo
            }, 
            active: "home"
        }
        res.render('home', metadata)
    })
}

module.exports = homeroute