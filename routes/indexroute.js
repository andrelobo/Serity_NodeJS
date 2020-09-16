
const indexroute = (app) => {
    app.get('/', (req, res) => {
        res.render('index')
    })
}

module.exports = indexroute