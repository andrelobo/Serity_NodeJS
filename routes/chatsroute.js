
const chatsroute = (app,postgress_manager) => {
    app.get('/chats', (req, res) => {
        res.render('chats', {user: {name: req.session.name, email: req.session.email, nivel: req.session.nivel }, active: "chats"})
    })
}

module.exports = chatsroute