
const conteudosroute = (app,postgress_manager,uploader) => {

    /* #START# PROFESSOR ################################################################ */
    
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

    /* #END# PROFESSOR ################################################################ */

    /* #START# ALUNO ################################################################## */

    app.get('/aluno/conteudos', (req, res) => {
        postgress_manager.conteudo_select5(req,res)
    })

    app.get('/aluno/conteudo/vizualisar', (req, res) => {
        postgress_manager.conteudo_select6(req,res)
    })

    /* #END# ALUNO #################################################################### */

    /* #START# ADMIN ################################################################## */

    app.get('/admin/conteudos', (req, res) => {
        postgress_manager.conteudo_select(req,res)
     })

    /* #END# ADMIN #################################################################### */
    
}

module.exports = conteudosroute