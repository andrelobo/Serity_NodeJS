
const indexroute = (app,postgress_manager) => {
    app.get('/', (req, res) => {
        res.render('index')
    })

    app.post('/', (req, res) => {
        postgress_manager.login_select(req,res)
    })
}

module.exports = indexroute