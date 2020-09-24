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

        if(req.body.user == "admin"  && req.body.pass == "CsGrede371s7"){
            req.session.name = req.body.user
            req.session.nivel = '3'
            res.redirect("home")
        }else{
            aluno =  "SELECT alu_nome, alu_codigo"
            aluno += " FROM aluno, moodle_usuarios"
            aluno += " WHERE moa_senha = '"+req.body.pass+"' AND"
            aluno += " moa_login = '"+req.body.user+"' AND "
            aluno += " moa_alucod = alu_codigo";

            professor =  "SELECT pro_nome, pro_codigo"
            professor += " FROM usuario, professor"
            professor += " WHERE usu_senha = '"+req.body.pass+"' AND"
            professor += " usu_usuario = '"+req.body.user+"' AND "
            professor += " usu_codigo = pro_usucod AND usu_status = 't'";

            pool.query(aluno, (err, query_result) => {
                if(query_result.rows != ""){
                    req.session.name = query_result.rows[0].alu_nome
                    req.session.codigo = query_result.rows[0].alu_codigo
                    req.session.nivel = '1'
                    res.redirect("home")
                }else{
                    pool.query(professor, (err, query_result) => {
                        if(query_result.rows != ""){
                            req.session.name = query_result.rows[0].pro_nome
                            req.session.codigo = query_result.rows[0].pro_codigo
                            req.session.nivel = '2'
                            res.redirect("home")
                        }else{
                            //colocar alerta para o usuario que o usuario não exite
                            res.redirect("/")
                        }
                    })
                }
            })
        }
    }
    const login_insert = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
/* #END# Login/Cadastro */

/* #START# Conteudo */
    const conteudo_select = (req,res) => {
        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "conteudos",
            conteudos: [
                {
                    disciplina: "Matematica",
                    turma: "3º EM C",
                    codigo: "1"
                },
                {
                    disciplina: "Informatica",
                    turma: "3º EM A",
                    codigo: "2"
                },
                {
                    disciplina: "Ciencias",
                    turma: "3º EM B",
                    codigo: "3"
                }
            ]
        }
        return metadata

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
/* #END# Trabalho */

/* #START# Avaliacao */
    const avaliacao_select = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const avaliacao_insert = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const avaliacao_update = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const avaliacao_delete = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
/* #END# Avaliacao */

/* #START# Log */
    const log_select = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const log_insert = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
    const log_delete = (req,res) => {

        console.log(req.body)
        res.redirect("home")

    }
/* #END# Log */

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
    "trabalho_delete": trabalho_delete,

    "avaliacao_select": avaliacao_select,
    "avaliacao_insert": avaliacao_insert,
    "avaliacao_update": avaliacao_update,
    "avaliacao_delete": avaliacao_delete,

    "log_select": log_select,
    "log_insert": log_insert,
    "log_delete": log_delete
}