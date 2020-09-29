
const conteudosroute = (app,postgress_manager,uploader) => {

    app.get('/professor/conteudos', (req, res) => {
       postgress_manager.conteudo_select(req,res)
    })

    app.get('/professor/conteudos/adicionar', (req, res) => {
        postgress_manager.conteudo_select(req,res)
    })

    app.get('/professor/conteudos/visualizar', (req, res) => {
        postgress_manager.conteudo_select(req,res)
    })

    app.get('/professor/conteudos/editar', (req, res) => {
        postgress_manager.conteudo_select(req,res)
    })

    app.post('/professor/conteudos', uploader.array('anexos'), function (req, res) {
        postgress_manager.conteudo_insert(req,res)
    })

}

module.exports = conteudosroute