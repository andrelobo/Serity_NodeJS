
const conteudosroute = (app,postgress_manager,uploader) => {

    app.get('/conteudos', (req, res) => {
       var metadata = postgress_manager.conteudo_select(req,res)
       res.render('conteudos', metadata)
    })

    app.post('/conteudos', uploader.array('anexos'), function (req, res, next) {
        console.log(req.files)
        console.log(req.body)
        res.redirect('/conteudos')
    })

}

module.exports = conteudosroute