
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
        postgress_manager.conteudo_select3(req,res)
    })

    app.get('/professor/conteudos/editar', (req, res) => {
        postgress_manager.conteudo_select4(req,res)
    })

    app.post('/professor/conteudos/editar', uploader.array('anexos'), (req, res) => {
        postgress_manager.conteudo_update(req,res)
    })

    app.post('/professor/conteudos/deletar', (req, res) => {
        console.log("[X]deletado um conteudo: "+JSON.stringify(req.body))
        postgress_manager.conteudo_delete(req,res)
    })

}

module.exports = conteudosroute