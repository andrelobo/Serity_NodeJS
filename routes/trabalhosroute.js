
const trabalhosroute = (app,postgress_manager,uploader) => {

    app.get('/professor/trabalhos', (req, res) => {
       postgress_manager.trabalho_select(req,res)
    })

    app.get('/professor/trabalhos/adicionar', (req, res) => {
        postgress_manager.trabalho_select2(req,res)
    })

    app.post('/professor/trabalhos/adicionar', uploader.array('anexos'), function (req, res) {
        postgress_manager.trabalho_insert(req,res)
    })

    app.get('/professor/trabalhos/visualizar', (req, res) => {
        postgress_manager.trabalho_select3(req,res)
    })

    app.get('/professor/trabalhos/editar', (req, res) => {
        postgress_manager.trabalho_select4(req,res)
    })

    app.post('/professor/trabalhos/editar', uploader.array('anexos'), (req, res) => {
        postgress_manager.trabalho_update(req,res)
    })

    app.post('/professor/trabalhos/deletar', (req, res) => {
        console.log("[X] deletado um trabalho: "+JSON.stringify(req.body))
        postgress_manager.trabalho_delete(req,res)
    })
    
    /* #END# PROFESSOR ################################################################ */

    /* #START# ALUNO ################################################################## */

    app.get('/aluno/trabalhos', (req, res) => {
        postgress_manager.trabalho_select5(req,res)
    })

    app.get('/aluno/trabalho/vizualisar', (req, res) => {
        postgress_manager.trabalho_select6(req,res)
    })

    /* #END# ALUNO #################################################################### */

    /* #START# ADMIN ################################################################## */

    app.get('/admin/conteudos', (req, res) => {
        postgress_manager.conteudo_select(req,res)
     })

    /* #END# ADMIN #################################################################### */
}

module.exports = trabalhosroute