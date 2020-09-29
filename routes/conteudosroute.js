
const conteudosroute = (app,postgress_manager,uploader) => {

    app.get('/professor/conteudos', (req, res) => {
       postgress_manager.conteudo_select(req,res)
    })

    app.get('/professor/conteudos/adicionar', (req, res) => {
        postgress_manager.conteudo_select2(req,res)
    })

    app.post('/professor/conteudos/adicionar', uploader.array('anexos'), function (req, res) {
        postgress_manager.conteudo_insert(req,res)
    })

    app.get('/professor/conteudos/visualizar', (req, res) => {
        //postgress_manager.conteudo_select(req,res)
        res.render("professor/conteudos_visualizar")
    })

    app.get('/professor/conteudos/editar', (req, res) => {
        postgress_manager.conteudo_select(req,res)
    })

}

module.exports = conteudosroute