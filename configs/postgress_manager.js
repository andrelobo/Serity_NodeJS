const { Pool } = require('pg')

const pool = new Pool({
    user: 'newstar',
    host: '192.168.0.70',
    database: 'desenvolve_2',
    password: 'Enoisquesimula',
    port: 5432,
})

/* #START# Login/Cadastro */
    const login_select = (req,res) => {

        pool.query('SELECT * from bimestre', (err, query_result) => {
            console.log(err, query_result.rows)
            pool.end()
        })

        console.log(req.body)
        req.session.name = req.body.user
        req.session.email = req.body.pass
        req.session.nivel = '1'
        res.redirect("home")

    }
    const login_insert = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
/* #END# Login/Cadastro */

/* #START# Conteudo */
    const conteudo_select = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const conteudo_insert = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const conteudo_update = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const conteudo_delete = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
/* #END# Conteudo */

/* #START# Trabalho */
    const trabalho_select = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const trabalho_insert = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const trabalho_update = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const trabalho_delete = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
/* #END# Conteudo */


module.exports = {
    "login_select": login_select,
    "login_insert": login_insert,

    "conteudo_select": conteudo_select,
    "conteudo_insert": conteudo_insert,
    "conteudo_update": conteudo_update,
    "conteudo_delete": conteudo_delete,

    "trabalho_select": trabalho_select,
    "trabalho_insert": trabalho_insert,
    "trabalho_update": trabalho_update,
    "trabalho_delete": trabalho_delete
}