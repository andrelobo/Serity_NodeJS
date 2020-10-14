
const chatsroute = (app,postgress_manager) => {
    app.get('/professor/chats', (req, res) => {
        res.render('contents/professor/chats', {user: {name: req.session.name, nivel: req.session.nivel }, active: "chats"})
    })

    app.get('/aluno/chats', (req, res) => {
        res.render('contents/aluno/chats', {user: {name: req.session.name, nivel: req.session.nivel }, active: "chats"})
    })
}

module.exports = chatsroute