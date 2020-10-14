
const usuariosroute = (app,postgress_manager) => {
    app.get('/admin/usuarios', (req, res) => {
        postgress_manager.login_list(req,res);
    })

    app.all('/admin/usuarios/cadastrar', (req, res) => {
        postgress_manager.login_insert(req,res);
    })
}

module.exports = usuariosroute