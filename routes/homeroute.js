
const homeroute = (app) => {
    app.get('/home', (req, res) => {
        res.render('home')
    })
}

module.exports = homeroute