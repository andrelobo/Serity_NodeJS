
const conteudosroute = (app,postgress_manager) => {
    app.get('/conteudos', (req, res) => {
       var metadata = postgress_manager.conteudo_select(req,res)
       res.render('conteudos', metadata)
    })

}

module.exports = conteudosroute