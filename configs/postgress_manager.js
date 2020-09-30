const { Pool } = require('pg')

const pool = new Pool({
    user: 'newstar',
    host: '192.168.0.70',
    database: 'desenvolve_2',
    password: 'Enoisquesimula',
    port: 5432,
})

const currentYear = new Date().getFullYear()

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
            conteudos: [],
            turmas: [],
            disciplinas: []
        }

        var disciplinas = "select distinct dis_descricao, dis_codigo"
        disciplinas += " from diario, disciplina"
        disciplinas += " where dia_procod='"+req.session.codigo+"' and"
        disciplinas += " dia_ano='"+currentYear+"' and"
        disciplinas += " dia_ativo = 't' and"
        disciplinas += " dis_codigo = dia_discod"

        var classes = "select distinct cla_codigo, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        classes += " from diario, classe"
        classes += " where dia_procod='"+req.session.codigo+"' and"
        classes += " dia_ano='"+currentYear+"' and"
        classes += " dia_ativo = 't' and"
        classes += " cla_codigo = dia_clacod"

        var conteudos = "select moc_codigo, moc_titulo, moc_descricao, cla_anoserie, cla_ensino, cla_turma"
        conteudos += " from diario, moodle_conteudos, classe"
        conteudos += " where dia_procod='"+req.session.codigo+"' and"
        conteudos += " dia_ano='"+currentYear+"' and"
        conteudos += " dia_ativo = 't' and"
        conteudos += " moc_diacod = dia_codigo and"
        conteudos += " cla_codigo = dia_clacod"

        pool.query(disciplinas, (err, query_result) => {
            query_result.rows.forEach(row => {
                metadata.disciplinas.push({
                    codigo: row.dis_codigo, 
                    descricao: row.dis_descricao
                })
            });

            pool.query(classes, (err, query_result) => {
                query_result.rows.forEach(row => {
                    if(row.cla_ensino == "Ensino Fundamental"){
                        var ensino = "EF"
                     }else{
                         var ensino = "EM"
                     }
                    metadata.turmas.push({
                        codigo: row.cla_codigo, 
                        turma: row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                    })
                });

                pool.query(conteudos, (err, query_result) => {
                    query_result.rows.forEach(row => {
                        if(row.cla_ensino == "Ensino Fundamental"){
                           var ensino = "EF"
                        }else{
                            var ensino = "EM"
                        }
                        var sub_titulo = row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                        metadata.conteudos.push({
                            codigo: row.moc_codigo, 
                            titulo: row.moc_titulo+" - "+sub_titulo,
                            descricao: row.moc_descricao
                        })
                    });
    
                    res.render('contents/professor/conteudos', metadata)

                })

            })

        })

    }
    const conteudo_select2 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "conteudos",
            turmas: [],
            disciplinas: []
        }

        var disciplinas = "select distinct dis_descricao, dis_codigo"
        disciplinas += " from diario, disciplina"
        disciplinas += " where dia_procod='"+req.session.codigo+"' and"
        disciplinas += " dia_ano='"+currentYear+"' and"
        disciplinas += " dia_ativo = 't' and"
        disciplinas += " dis_codigo = dia_discod"

        var classes = "select distinct cla_codigo, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        classes += " from diario, classe"
        classes += " where dia_procod='"+req.session.codigo+"' and"
        classes += " dia_ano='"+currentYear+"' and"
        classes += " dia_ativo = 't' and"
        classes += " cla_codigo = dia_clacod"

        pool.query(disciplinas, (err, query_result) => {
            query_result.rows.forEach(row => {
                metadata.disciplinas.push({
                    codigo: row.dis_codigo, 
                    descricao: row.dis_descricao
                })
            });

            pool.query(classes, (err, query_result) => {
                query_result.rows.forEach(row => {
                    if(row.cla_ensino == "Ensino Fundamental"){
                        var ensino = "EF"
                     }else{
                         var ensino = "EM"
                     }
                    metadata.turmas.push({
                        codigo: row.cla_codigo, 
                        turma: row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                    })
                });

                res.render('contents/professor/conteudos_adicionar', metadata)

            })

        })

    }
    const conteudo_select3 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "conteudos",
            conteudo: []
        }

        var conteudo = "SELECT * from moodle_conteudos"
        conteudo += " where moc_codigo='"+req.query.codigo+"'"

        pool.query(conteudo, (err, query_result) => {
            console.log(err)
            metadata.conteudo.push(query_result.rows[0])
            console.log(metadata)
            res.render('contents/professor/conteudos_visualizar', metadata)
        });

    }
    const conteudo_select4 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "conteudos",
            turmas: [],
            disciplinas: []
        }

        var disciplinas = "select distinct dis_descricao, dis_codigo"
        disciplinas += " from diario, disciplina"
        disciplinas += " where dia_procod='"+req.session.codigo+"' and"
        disciplinas += " dia_ano='"+currentYear+"' and"
        disciplinas += " dia_ativo = 't' and"
        disciplinas += " dis_codigo = dia_discod"

        var classes = "select distinct cla_codigo, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        classes += " from diario, classe"
        classes += " where dia_procod='"+req.session.codigo+"' and"
        classes += " dia_ano='"+currentYear+"' and"
        classes += " dia_ativo = 't' and"
        classes += " cla_codigo = dia_clacod"

        pool.query(disciplinas, (err, query_result) => {
            query_result.rows.forEach(row => {
                metadata.disciplinas.push({
                    codigo: row.dis_codigo, 
                    descricao: row.dis_descricao
                })
            });

            pool.query(classes, (err, query_result) => {
                query_result.rows.forEach(row => {
                    if(row.cla_ensino == "Ensino Fundamental"){
                        var ensino = "EF"
                     }else{
                         var ensino = "EM"
                     }
                    metadata.turmas.push({
                        codigo: row.cla_codigo, 
                        turma: row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                    })
                });

                res.render('contents/professor/conteudos_editar', metadata)

            })

        })

    }
    const conteudo_insert = (req,res) => {

        var pega_diarios = "SELECT dia_codigo"
        pega_diarios += " FROM diario "
        pega_diarios += " WHERE dia_clacod IN ("+req.body.turma.join(",")+") AND"
        pega_diarios += " dia_discod IN ("+req.body.disciplina.join(",")+") AND"
        pega_diarios += " dia_procod = '"+req.session.codigo+"' AND"
        pega_diarios += " dia_ativo = 't' AND"
        pega_diarios += " dia_ano = '"+currentYear+"'"

        pool.query(pega_diarios, (err, query_result) => {
            query_result.rows.forEach(row => {

                var salva_contudo = "INSERT INTO moodle_conteudos"
                salva_contudo += " VALUES("
                salva_contudo += " DEFAULT,"
                salva_contudo += " '"+req.body.titulo+"',"
                salva_contudo += " '"+req.body.descricao+"',"
                salva_contudo += " '"+req.body.datai+"',"
                salva_contudo += " '"+req.body.dataf+"',"
                salva_contudo += " '"+row.dia_codigo+"',"
                
                salva_contudo += " 'f'"

                salva_contudo += " ) RETURNING moc_codigo"

                pool.query(salva_contudo, (err, query_result) => {

                    console.log("[!] Novo conteudo cadastrado codigo: "+query_result.rows[0].moc_codigo)
                    
                })
                
            })

            res.redirect("/professor/conteudos")

        })

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
    "conteudo_select2": conteudo_select2,
    "conteudo_select3": conteudo_select3,
    "conteudo_select4": conteudo_select4,
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