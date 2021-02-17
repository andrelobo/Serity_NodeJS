const { Pool } = require('pg')

const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: ,
})

const currentYear = new Date().getFullYear()

/* #START# Login/Cadastro */
    const login_select = (req,res) => {

        if(req.body.user == "admin"  && req.body.pass == "123"){
            req.session.name = req.body.user
            req.session.nivel = '3'
            res.redirect("home")
        }else{
            aluno =  "SELECT alu_nome, alu_codigo"
            aluno += " FROM aluno, moodle_usuarios"
            aluno += " WHERE mou_senha = '"+req.body.pass+"' AND"
            aluno += " mou_login = '"+req.body.user+"' AND "
            aluno += " mou_alucod = alu_codigo";

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

        var pega_alunos = "SELECT DISTINCT alu_codigo, alu_rm"
        pega_alunos += " FROM vidaescolar, aluno, classe"
        pega_alunos += " WHERE ves_alucod = alu_codigo AND"
        pega_alunos += " ves_ativo = 't' AND"
        pega_alunos += " ves_ano = '"+currentYear+"' AND"
        pega_alunos += " ves_clacod = cla_codigo AND"
        pega_alunos += " cla_turma != 'Z' AND"
        pega_alunos += " cla_ensino != 'Educação Infantil'"
        pega_alunos += " ORDER BY  alu_codigo ASC"

        pool.query(pega_alunos, (err, query_result) => {

            var count = query_result.rows.length
            var counter = 0;

            query_result.rows.forEach(row => {

                var insert_aluno = "INSERT INTO moodle_usuarios"
                    insert_aluno += " VALUES("
                    insert_aluno += " DEFAULT,"
                    insert_aluno += " '"+row.alu_rm+"',"
                    insert_aluno += " '123',"
                    insert_aluno += " 'f',"
                    insert_aluno += " NULL,"
                    insert_aluno += " '"+row.alu_codigo+"'"
                    insert_aluno += " );"

                pool.query(insert_aluno, (err, query_result) => {
                    counter++
                    if(counter == count){
                        res.redirect("/admin/usuarios")
                    }
                })

            });

        })      

    }
    const login_list = (req,res) => {
        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            },
            active: "usuarios",
            usuarios: []
        }

        var list_all_logins = "SELECT *"
        list_all_logins += " FROM moodle_usuarios, aluno, classe, vidaescolar"
        list_all_logins += " WHERE mou_alucod = alu_codigo AND"
        list_all_logins += " ves_alucod = alu_codigo AND"
        list_all_logins += " ves_clacod = cla_codigo AND"
        list_all_logins += " ves_ativo = 't' AND"
        list_all_logins += " ves_ano = '"+currentYear+"'"

        pool.query(list_all_logins, (err, query_result) => {
            var count = query_result.rows.length
            var counter = 0;
            query_result.rows.forEach(row => {
                if(row.cla_ensino == "Ensino Fundamental"){
                    var ensino = "EF"
                 }else{
                     var ensino = "EM"
                 }
                var turma = row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                metadata.usuarios.push({
                    nome: row.alu_nome, 
                    login: row.mou_login,
                    senha: row.mou_senha,
                    last_seen: row.mou_last_online,
                    turma: turma
                })
                counter++
                if(counter == count){
                    res.render('contents/admin/usuarios', metadata)
                }
            });
        })
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
            conteudo: [],
            anexos: []
        }

        var conteudo = "SELECT moc_titulo, moc_descricao, moc_datai, moc_dataf, moc_anexos, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        conteudo += " FROM moodle_conteudos, diario, classe"
        conteudo += " WHERE moc_codigo='"+req.query.codigo+"' AND"
        conteudo += " dia_codigo = moc_diacod  AND"
        conteudo += " cla_codigo = dia_clacod"

        pool.query(conteudo, (err, query_result) => {

            if(query_result.rows[0].cla_ensino == "Ensino Fundamental"){
                var ensino = "EF"
            }else{
                var ensino = "EM"
            }
            var turma = query_result.rows[0].cla_anoserie+"º "+ensino+" "+query_result.rows[0].cla_turma

            var datai = query_result.rows[0].moc_datai.toISOString().slice(0,16).split("T");
            var datai_date = datai[0].split("-")
            datai = datai_date[2]+"/"+datai_date[1]+"/"+datai_date[0]+" "+datai[1]

            var dataf = query_result.rows[0].moc_dataf.toISOString().slice(0,16).split("T");
            var dataf_date = dataf[0].split("-")
            dataf = dataf_date[2]+"/"+dataf_date[1]+"/"+dataf_date[0]+" "+dataf[1]

            metadata.conteudo.push({
                titulo: query_result.rows[0].moc_titulo,
                descricao: query_result.rows[0].moc_descricao,
                datai: datai,
                dataf: dataf,
                have_anexos: query_result.rows[0].moc_anexos,
                turma: turma
            })

            if(query_result.rows[0].moc_anexos == true){

                var pega_anexos = "SELECT moa_path, moa_oriname, moa_filename FROM moodle_anexos"
                pega_anexos += " WHERE moa_moccod = '"+req.query.codigo+"'"

                pool.query(pega_anexos, (err, query_result_anexos) => {
                    var count = query_result_anexos.rows.length
                    var conter = 0;
                    query_result_anexos.rows.forEach(row => {
                        metadata.anexos.push({
                            path: row.moa_path,
                            oriname: row.moa_oriname,
                            filename: row.moa_filename
                        })
                        conter++
                        if(conter == count){
                            res.render('contents/professor/conteudos_visualizar', metadata)
                        }
                    })
                });

            }else{
                res.render('contents/professor/conteudos_visualizar', metadata)
            }

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
            disciplinas: [],
            conteudo: [],
            anexos: []
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

                var conteudo = "SELECT moc_codigo, moc_titulo, moc_descricao, moc_datai, moc_dataf, moc_anexos, cla_anoserie, cla_turma, cla_periodo, cla_ensino, cla_codigo, dia_discod"
                conteudo += " FROM moodle_conteudos, diario, classe"
                conteudo += " WHERE moc_codigo='"+req.query.codigo+"' AND"
                conteudo += " dia_codigo = moc_diacod  AND"
                conteudo += " cla_codigo = dia_clacod"

                pool.query(conteudo, (err, query_result) => {

                    if(query_result.rows[0].cla_ensino == "Ensino Fundamental"){
                        var ensino = "EF"
                    }else{
                        var ensino = "EM"
                    }
                    var turma = query_result.rows[0].cla_anoserie+"º "+ensino+" "+query_result.rows[0].cla_turma

                    metadata.conteudo.push({
                        titulo: query_result.rows[0].moc_titulo,
                        descricao: query_result.rows[0].moc_descricao,
                        datai: query_result.rows[0].moc_datai.toISOString().slice(0,16),
                        dataf: query_result.rows[0].moc_dataf.toISOString().slice(0,16),
                        have_anexos: query_result.rows[0].moc_anexos,
                        turma: turma,
                        turma_codigo: query_result.rows[0].cla_codigo,
                        dis_codigo: query_result.rows[0].dia_discod,
                        codigo: query_result.rows[0].moc_codigo
                    })

                    if(query_result.rows[0].moc_anexos == true){

                        var pega_anexos = "SELECT moa_codigo, moa_path, moa_oriname, moa_filename FROM moodle_anexos"
                        pega_anexos += " WHERE moa_moccod = '"+req.query.codigo+"'"

                        pool.query(pega_anexos, (err, query_result_anexos) => {
                            var count = query_result_anexos.rows.length
                            var conter = 0;
                            query_result_anexos.rows.forEach(row => {
                                metadata.anexos.push({
                                    path: row.moa_path,
                                    oriname: row.moa_oriname,
                                    filename: row.moa_filename,
                                    codigo: row.moa_codigo
                                })
                                conter++
                                if(conter == count){
                                    res.render('contents/professor/conteudos_editar', metadata)
                                }
                            })
                        });

                    }else{
                        res.render('contents/professor/conteudos_editar', metadata) 
                    }

                });

            })

        })

    }
    const conteudo_select5 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "conteudos",
            conteudos: []
        }

        var conteudos = "select moc_codigo, moc_titulo, moc_descricao, cla_anoserie, cla_ensino, cla_turma"
        conteudos += " from diario, moodle_conteudos, classe, vidaescolar"
        conteudos += " WHERE moc_diacod = dia_codigo AND"
        conteudos += " dia_clacod = cla_codigo AND"
        conteudos += " cla_codigo = ves_clacod AND"
        conteudos += " ves_ativo = 't' AND"
        conteudos += " dia_ativo = 't' AND"
        conteudos += " ves_ano = dia_ano AND"
        conteudos += " ves_ano = '"+currentYear+"' AND"
        conteudos += " ves_alucod = '"+req.session.codigo+"'"
    
        pool.query(conteudos, (err, query_result) => {
            console.log(conteudos,err)
            var count = query_result.rows.length
            var counter = 0;
            query_result.rows.forEach(row => {
                counter++
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
                if(counter == count){
                    res.render('contents/aluno/conteudos', metadata)
                }
            });
        })
    }
    const conteudo_select6 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "conteudos",
            conteudo: [],
            anexos: []
        }

        var conteudo = "SELECT moc_titulo, moc_descricao, moc_datai, moc_dataf, moc_anexos, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        conteudo += " FROM moodle_conteudos, diario, classe"
        conteudo += " WHERE moc_codigo='"+req.query.codigo+"' AND"
        conteudo += " dia_codigo = moc_diacod  AND"
        conteudo += " cla_codigo = dia_clacod"

        pool.query(conteudo, (err, query_result) => {

            if(query_result.rows[0].cla_ensino == "Ensino Fundamental"){
                var ensino = "EF"
            }else{
                var ensino = "EM"
            }
            var turma = query_result.rows[0].cla_anoserie+"º "+ensino+" "+query_result.rows[0].cla_turma

            var datai = query_result.rows[0].moc_datai.toISOString().slice(0,16).split("T");
            var datai_date = datai[0].split("-")
            datai = datai_date[2]+"/"+datai_date[1]+"/"+datai_date[0]+" "+datai[1]

            var dataf = query_result.rows[0].moc_dataf.toISOString().slice(0,16).split("T");
            var dataf_date = dataf[0].split("-")
            dataf = dataf_date[2]+"/"+dataf_date[1]+"/"+dataf_date[0]+" "+dataf[1]

            metadata.conteudo.push({
                titulo: query_result.rows[0].moc_titulo,
                descricao: query_result.rows[0].moc_descricao,
                datai: datai,
                dataf: dataf,
                have_anexos: query_result.rows[0].moc_anexos,
                turma: turma
            })

            if(query_result.rows[0].moc_anexos == true){

                var pega_anexos = "SELECT moa_path, moa_oriname, moa_filename FROM moodle_anexos"
                pega_anexos += " WHERE moa_moccod = '"+req.query.codigo+"'"

                pool.query(pega_anexos, (err, query_result_anexos) => {
                    var count = query_result_anexos.rows.length
                    var conter = 0;
                    query_result_anexos.rows.forEach(row => {
                        metadata.anexos.push({
                            path: row.moa_path,
                            oriname: row.moa_oriname,
                            filename: row.moa_filename
                        })
                        conter++
                        if(conter == count){
                            res.render('contents/aluno/conteudos_visualizar', metadata)
                        }
                    })
                });

            }else{
                res.render('contents/aluno/conteudos_visualizar', metadata)
            }

        });

    }
    const conteudo_insert = (req,res) => {

        var pega_diarios = "SELECT DISTINCT dia_codigo"
        pega_diarios += " FROM diario WHERE"

        if(typeof req.body.turma == "string"){
            pega_diarios += " dia_clacod = '"+req.body.turma+"' AND"
        }else{
            pega_diarios += " dia_clacod IN ("+req.body.turma.join(",")+") AND"
        }

        if(typeof req.body.disciplina == "string"){
            pega_diarios += " dia_discod = '"+req.body.disciplina+"' AND"
        }else{
            pega_diarios += " dia_discod IN ("+req.body.disciplina.join(",")+") AND"
        }

        pega_diarios += " dia_procod = '"+req.session.codigo+"' AND"
        pega_diarios += " dia_ativo = 't' AND"
        pega_diarios += " dia_ano = '"+currentYear+"'"
        pool.query(pega_diarios, (err, query_result) => {
            var count = query_result.rows.length
            var counter = 0;
            query_result.rows.forEach(row => {

                var salva_contudo = "INSERT INTO moodle_conteudos"
                salva_contudo += " VALUES("
                salva_contudo += " DEFAULT,"
                salva_contudo += " '"+req.body.titulo+"',"
                salva_contudo += " '"+req.body.descricao+"',"
                salva_contudo += " '"+req.body.datai+"',"
                salva_contudo += " '"+req.body.dataf+"',"
                salva_contudo += " '"+row.dia_codigo+"',"
                
                if(req.files == ""){
                    salva_contudo += " 'f'"
                }else{
                    salva_contudo += " 't'"
                }

                salva_contudo += " ) RETURNING moc_codigo;"

                pool.query(salva_contudo, (err, query_result) => {

                    console.log("[!] Novo conteudo cadastrado codigo: "+query_result.rows[0].moc_codigo)
                    
                    if(req.files != ""){
                        var count_files = req.files.length
                        var counter_files = 0;
                        
                        req.files.forEach(file => {
                            var salva_anexo = "INSERT INTO moodle_anexos"
                            salva_anexo += " VALUES("
                            salva_anexo += " DEFAULT,"
                            salva_anexo += " '"+file.path+"',"
                            salva_anexo += " '"+file.originalname+"',"
                            salva_anexo += " '"+file.filename+"',"
                            salva_anexo += " '"+query_result.rows[0].moc_codigo+"'"
                            salva_anexo += " )"
                            pool.query(salva_anexo, (err, query_result) => {
                                counter_files++
                                if(counter_files==count_files){
                                    counter++
                                }
                                if(counter == count){
                                    res.redirect("/professor/conteudos")
                                }
                            })
                        })
                    }else{
                        counter++
                        if(counter == count){
                            res.redirect("/professor/conteudos")
                        }
                    }
                })
                
            })

        })

    }
    const conteudo_update = (req,res) => {

        var pega_diarios = "SELECT DISTINCT dia_codigo"
        pega_diarios += " FROM diario WHERE"
        pega_diarios += " dia_clacod = '"+req.body.turma+"' AND"
        pega_diarios += " dia_discod = '"+req.body.disciplina+"' AND"
        pega_diarios += " dia_procod = '"+req.session.codigo+"' AND"
        pega_diarios += " dia_ativo = 't' AND"
        pega_diarios += " dia_ano = '"+currentYear+"'"
        
        pool.query(pega_diarios, (err, query_result) => {

            var edita_contudo = "UPDATE moodle_conteudos"
            edita_contudo += " SET moc_titulo = '"+req.body.titulo+"',"
            edita_contudo += " moc_descricao = '"+req.body.descricao+"',"
            edita_contudo += " moc_datai = '"+req.body.datai+"',"
            edita_contudo += " moc_dataf = '"+req.body.dataf+"',"
            
            if(req.files != ""){
                edita_contudo += " moc_diacod = '"+query_result.rows[0].dia_codigo+"',"
                edita_contudo += " moc_anexos = 't'"
            }else{
                edita_contudo += " moc_diacod = '"+query_result.rows[0].dia_codigo+"'"
            }

            edita_contudo += " WHERE moc_codigo = '"+req.body.codigo+"'"

            pool.query(edita_contudo, (err, query_result) => {
                console.log("[!] conteudo editado codigo: "+req.body.codigo)
                
                if(req.files != ""){
                    var count_files = req.files.length
                    var counter_files = 0;
                    
                    req.files.forEach(file => {
                        var salva_anexo = "INSERT INTO moodle_anexos"
                        salva_anexo += " VALUES("
                        salva_anexo += " DEFAULT,"
                        salva_anexo += " '"+file.path+"',"
                        salva_anexo += " '"+file.originalname+"',"
                        salva_anexo += " '"+file.filename+"',"
                        salva_anexo += " '"+req.body.codigo+"'"
                        salva_anexo += " )"
                        pool.query(salva_anexo, (err, query_result) => {
                            counter_files++
                            if(counter_files==count_files){
                                res.redirect("/professor/conteudos")
                            }
                        })
                    })
                }else{
                    res.redirect("/professor/conteudos")
                }
            })

        })

    }
    const conteudo_delete = (req,res) => {

        var del_conteudo = "delete from moodle_conteudos"
        del_conteudo += " where moc_codigo='"+req.body.codigo+"'"

        pool.query(del_conteudo, (err, query_result) => {
            res.status(200)
            res.send(err)
        })

    }
    const conteudo_anexo_delete = (req,res,fs) => {
        fs.unlink(req.body.anexo, (err) => {
            if (err) {
                var delete_anexo = "DELETE FROM moodle_anexos";
                delete_anexo += " WHERE moa_codigo = '"+req.body.anexo+"'";
                delete_anexo += " RETURNING moa_moccod";
                pool.query(delete_anexo, (err, query_result) => {
                    var anexosExists = "SELECT count(*) from moodle_anexos"
                    anexosExists += " where moa_moccod = '"+query_result.rows[0].moa_moccod+"'"
                    pool.query(anexosExists, (err, query_result2) => {
                        if(query_result2.rows[0].count == 0){
                            var updateAnexosConteudos = "UPDATE moodle_conteudos"
                            updateAnexosConteudos += " SET moc_anexos='f' "
                            updateAnexosConteudos += "where moc_codigo='"+query_result.rows[0].moa_moccod+"' "
                            pool.query(anexosExists, (err, query_result3) => {
                                res.status(200).send("OK")
                            })
                        }else{
                            res.status(200).send("OK")
                        }
                    })
                })
            }else{
                res.status(404).send(err)
            }
        })
    }
/* #END# Conteudo */

/* #START# Trabalho */
    const trabalho_select = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "trabalhos",
            trabalhos: [],
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

        var trabalhos = "select mot_codigo, mot_titulo, mot_descricao, cla_anoserie, cla_ensino, cla_turma"
        trabalhos += " from diario, moodle_trabalhos, classe"
        trabalhos += " where dia_procod='"+req.session.codigo+"' and"
        trabalhos += " dia_ano='"+currentYear+"' and"
        trabalhos += " dia_ativo = 't' and"
        trabalhos += " mot_diacod = dia_codigo and"
        trabalhos += " cla_codigo = dia_clacod"

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

                pool.query(trabalhos, (err, query_result) => {
                    query_result.rows.forEach(row => {
                        if(row.cla_ensino == "Ensino Fundamental"){
                        var ensino = "EF"
                        }else{
                            var ensino = "EM"
                        }
                        var sub_titulo = row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                        metadata.trabalhos.push({
                            codigo: row.mot_codigo, 
                            titulo: row.mot_titulo+" - "+sub_titulo,
                            descricao: row.mot_descricao
                        })
                    });

                    res.render('contents/professor/trabalhos', metadata)

                })

            })

        })

    }
    const trabalho_select2 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "trabalhos",
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

                res.render('contents/professor/trabalhos_adicionar', metadata)

            })

        })

    }
    const trabalho_select3 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "trabalhos",
            trabalho: [],
            anexos: []
        }

        var trabalho = "SELECT mot_titulo, mot_descricao, mot_datai, mot_dataf, mot_anexos, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        trabalho += " FROM moodle_trabalhos, diario, classe"
        trabalho += " WHERE mot_codigo='"+req.query.codigo+"' AND"
        trabalho += " dia_codigo = mot_diacod  AND"
        trabalho += " cla_codigo = dia_clacod"

        pool.query(trabalho, (err, query_result) => {

            if(query_result.rows[0].cla_ensino == "Ensino Fundamental"){
                var ensino = "EF"
            }else{
                var ensino = "EM"
            }
            var turma = query_result.rows[0].cla_anoserie+"º "+ensino+" "+query_result.rows[0].cla_turma

            var datai = query_result.rows[0].mot_datai.toISOString().slice(0,16).split("T");
            var datai_date = datai[0].split("-")
            datai = datai_date[2]+"/"+datai_date[1]+"/"+datai_date[0]+" "+datai[1]

            var dataf = query_result.rows[0].mot_dataf.toISOString().slice(0,16).split("T");
            var dataf_date = dataf[0].split("-")
            dataf = dataf_date[2]+"/"+dataf_date[1]+"/"+dataf_date[0]+" "+dataf[1]

            metadata.trabalho.push({
                titulo: query_result.rows[0].mot_titulo,
                descricao: query_result.rows[0].mot_descricao,
                datai: datai,
                dataf: dataf,
                have_anexos: query_result.rows[0].mot_anexos,
                turma: turma
            })

            if(query_result.rows[0].mot_anexos == true){

                var pega_anexos = "SELECT moa_path, moa_oriname, moa_filename FROM moodle_anexos"
                pega_anexos += " WHERE moa_motcod = '"+req.query.codigo+"'"

                pool.query(pega_anexos, (err, query_result_anexos) => {
                    var count = query_result_anexos.rows.length
                    var conter = 0;
                    query_result_anexos.rows.forEach(row => {
                        metadata.anexos.push({
                            path: row.moa_path,
                            oriname: row.moa_oriname,
                            filename: row.moa_filename
                        })
                        conter++
                        if(conter == count){
                            res.render('contents/professor/trabalhos_visualizar', metadata)
                        }
                    })
                });

            }else{
                res.render('contents/professor/trabalhos_visualizar', metadata)
            }

        });

    }
    const trabalho_select4 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "trabalhos",
            turmas: [],
            disciplinas: [],
            trabalho: [],
            anexos: []
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

                var trabalho = "SELECT mot_codigo, mot_titulo, mot_descricao, mot_datai, mot_dataf, mot_anexos, cla_anoserie, cla_turma, cla_periodo, cla_ensino, cla_codigo, dia_discod"
                trabalho += " FROM moodle_trabalhos, diario, classe"
                trabalho += " WHERE mot_codigo='"+req.query.codigo+"' AND"
                trabalho += " dia_codigo = mot_diacod  AND"
                trabalho += " cla_codigo = dia_clacod"

                pool.query(trabalho, (err, query_result) => {

                    if(query_result.rows[0].cla_ensino == "Ensino Fundamental"){
                        var ensino = "EF"
                    }else{
                        var ensino = "EM"
                    }
                    var turma = query_result.rows[0].cla_anoserie+"º "+ensino+" "+query_result.rows[0].cla_turma

                    metadata.trabalho.push({
                        titulo: query_result.rows[0].mot_titulo,
                        descricao: query_result.rows[0].mot_descricao,
                        datai: query_result.rows[0].mot_datai.toISOString().slice(0,16),
                        dataf: query_result.rows[0].mot_dataf.toISOString().slice(0,16),
                        have_anexos: query_result.rows[0].mot_anexos,
                        turma: turma,
                        turma_codigo: query_result.rows[0].cla_codigo,
                        dis_codigo: query_result.rows[0].dia_discod,
                        codigo: query_result.rows[0].mot_codigo
                    })

                    if(query_result.rows[0].mot_anexos == true){

                        var pega_anexos = "SELECT moa_codigo, moa_path, moa_oriname, moa_filename FROM moodle_anexos"
                        pega_anexos += " WHERE moa_motcod = '"+req.query.codigo+"'"

                        pool.query(pega_anexos, (err, query_result_anexos) => {
                            var count = query_result_anexos.rows.length
                            var conter = 0;
                            query_result_anexos.rows.forEach(row => {
                                metadata.anexos.push({
                                    path: row.moa_path,
                                    oriname: row.moa_oriname,
                                    filename: row.moa_filename,
                                    codigo: row.moa_codigo
                                })
                                conter++
                                if(conter == count){
                                    res.render('contents/professor/trabalhos_editar', metadata)
                                }
                            })
                        });

                    }else{
                        res.render('contents/professor/trabalhos_editar', metadata) 
                    }

                });

            })

        })

    }
    const trabalho_select5 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "trabalhos",
            trabalhos: []
        }

        var trabalhos = "select mot_codigo, mot_titulo, mot_descricao, cla_anoserie, cla_ensino, cla_turma"
        trabalhos += " from diario, moodle_trabalhos, classe, vidaescolar"
        trabalhos += " WHERE mot_diacod = dia_codigo AND"
        trabalhos += " dia_clacod = cla_codigo AND"
        trabalhos += " cla_codigo = ves_clacod AND"
        trabalhos += " ves_ativo = 't' AND"
        trabalhos += " dia_ativo = 't' AND"
        trabalhos += " ves_ano = dia_ano AND"
        trabalhos += " ves_ano = '"+currentYear+"' AND"
        trabalhos += " ves_alucod = '"+req.session.codigo+"'"
    
        pool.query(trabalhos, (err, query_result) => {
            var count = query_result.rows.length
            var counter = 0;
            query_result.rows.forEach(row => {
                counter++
                if(row.cla_ensino == "Ensino Fundamental"){
                    var ensino = "EF"
                }else{
                    var ensino = "EM"
                }
                var sub_titulo = row.cla_anoserie+"º "+ensino+" "+row.cla_turma
                metadata.trabalhos.push({
                    codigo: row.mot_codigo, 
                    titulo: row.mot_titulo+" - "+sub_titulo,
                    descricao: row.mot_descricao
                })
                if(counter == count){
                    res.render('contents/aluno/trabalhos', metadata)
                }
            });
        })
    }
    const trabalho_select6 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "trabalhos",
            trabalho: [],
            anexos: []
        }

        var trabalho = "SELECT mot_titulo, mot_descricao, mot_datai, mot_dataf, mot_anexos, cla_anoserie, cla_turma, cla_periodo, cla_ensino"
        trabalho += " FROM moodle_trabalhos, diario, classe"
        trabalho += " WHERE mot_codigo='"+req.query.codigo+"' AND"
        trabalho += " dia_codigo = mot_diacod  AND"
        trabalho += " cla_codigo = dia_clacod"

        pool.query(trabalho, (err, query_result) => {

            if(query_result.rows[0].cla_ensino == "Ensino Fundamental"){
                var ensino = "EF"
            }else{
                var ensino = "EM"
            }
            var turma = query_result.rows[0].cla_anoserie+"º "+ensino+" "+query_result.rows[0].cla_turma

            var datai = query_result.rows[0].mot_datai.toISOString().slice(0,16).split("T");
            var datai_date = datai[0].split("-")
            datai = datai_date[2]+"/"+datai_date[1]+"/"+datai_date[0]+" "+datai[1]

            var dataf = query_result.rows[0].mot_dataf.toISOString().slice(0,16).split("T");
            var dataf_date = dataf[0].split("-")
            dataf = dataf_date[2]+"/"+dataf_date[1]+"/"+dataf_date[0]+" "+dataf[1]

            metadata.trabalho.push({
                titulo: query_result.rows[0].mot_titulo,
                descricao: query_result.rows[0].mot_descricao,
                datai: datai,
                dataf: dataf,
                have_anexos: query_result.rows[0].mot_anexos,
                turma: turma
            })

            if(query_result.rows[0].mot_anexos == true){

                var pega_anexos = "SELECT moa_path, moa_oriname, moa_filename FROM moodle_anexos"
                pega_anexos += " WHERE moa_motcod = '"+req.query.codigo+"'"

                pool.query(pega_anexos, (err, query_result_anexos) => {
                    var count = query_result_anexos.rows.length
                    var conter = 0;
                    query_result_anexos.rows.forEach(row => {
                        metadata.anexos.push({
                            path: row.moa_path,
                            oriname: row.moa_oriname,
                            filename: row.moa_filename
                        })
                        conter++
                        if(conter == count){
                            res.render('contents/aluno/trabalhos_visualizar', metadata)
                        }
                    })
                });

            }else{
                res.render('contents/aluno/trabalhos_visualizar', metadata)
            }

        });

    }
    const trabalho_insert = (req,res) => {

        var pega_diarios = "SELECT DISTINCT dia_codigo"
        pega_diarios += " FROM diario WHERE"

        if(typeof req.body.turma == "string"){
            pega_diarios += " dia_clacod = '"+req.body.turma+"' AND"
        }else{
            pega_diarios += " dia_clacod IN ("+req.body.turma.join(",")+") AND"
        }

        if(typeof req.body.disciplina == "string"){
            pega_diarios += " dia_discod = '"+req.body.disciplina+"' AND"
        }else{
            pega_diarios += " dia_discod IN ("+req.body.disciplina.join(",")+") AND"
        }

        pega_diarios += " dia_procod = '"+req.session.codigo+"' AND"
        pega_diarios += " dia_ativo = 't' AND"
        pega_diarios += " dia_ano = '"+currentYear+"'"
        pool.query(pega_diarios, (err, query_result) => {
            var count = query_result.rows.length
            var counter = 0;
            query_result.rows.forEach(row => {

                var salva_trabalho = "INSERT INTO moodle_trabalhos"
                salva_trabalho += " VALUES("
                salva_trabalho += " DEFAULT,"
                salva_trabalho += " '"+req.body.titulo+"',"
                salva_trabalho += " '"+req.body.descricao+"',"
                salva_trabalho += " '"+req.body.datai+"',"
                salva_trabalho += " '"+req.body.dataf+"',"
                salva_trabalho += " '"+row.dia_codigo+"',"
                
                if(req.files == ""){
                    salva_trabalho += " 'f'"
                }else{
                    salva_trabalho += " 't'"
                }

                salva_trabalho += " ) RETURNING mot_codigo;"

                pool.query(salva_trabalho, (err, query_result) => {
                    console.log("[!] Novo trabalho cadastrado codigo: "+query_result.rows[0].mot_codigo)
                    
                    if(req.files != ""){
                        var count_files = req.files.length
                        var counter_files = 0;
                        
                        req.files.forEach(file => {
                            var salva_anexo = "INSERT INTO moodle_anexos"
                            salva_anexo += " VALUES("
                            salva_anexo += " DEFAULT,"
                            salva_anexo += " '"+file.path+"',"
                            salva_anexo += " '"+file.originalname+"',"
                            salva_anexo += " '"+file.filename+"',"
                            salva_anexo += " NULL,"
                            salva_anexo += " '"+query_result.rows[0].mot_codigo+"'"
                            salva_anexo += " )"
                            console.log(salva_anexo)
                            pool.query(salva_anexo, (err, query_result) => {
                                console.log(err)
                                counter_files++
                                if(counter_files==count_files){
                                    counter++
                                }
                                if(counter == count){
                                    res.redirect("/professor/trabalhos")
                                }
                            })
                        })
                    }else{
                        counter++
                        if(counter == count){
                            res.redirect("/professor/trabalhos")
                        }
                    }
                })
                
            })

        })

    }
    const trabalho_update = (req,res) => {

        var pega_diarios = "SELECT DISTINCT dia_codigo"
        pega_diarios += " FROM diario WHERE"
        pega_diarios += " dia_clacod = '"+req.body.turma+"' AND"
        pega_diarios += " dia_discod = '"+req.body.disciplina+"' AND"
        pega_diarios += " dia_procod = '"+req.session.codigo+"' AND"
        pega_diarios += " dia_ativo = 't' AND"
        pega_diarios += " dia_ano = '"+currentYear+"'"
        
        pool.query(pega_diarios, (err, query_result) => {

            var edita_contudo = "UPDATE moodle_trabalhos"
            edita_contudo += " SET mot_titulo = '"+req.body.titulo+"',"
            edita_contudo += " mot_descricao = '"+req.body.descricao+"',"
            edita_contudo += " mot_datai = '"+req.body.datai+"',"
            edita_contudo += " mot_dataf = '"+req.body.dataf+"',"
            
            if(req.files != ""){
                edita_contudo += " mot_diacod = '"+query_result.rows[0].dia_codigo+"',"
                edita_contudo += " mot_anexos = 't'"
            }else{
                edita_contudo += " mot_diacod = '"+query_result.rows[0].dia_codigo+"'"
            }

            edita_contudo += " WHERE mot_codigo = '"+req.body.codigo+"'"

            pool.query(edita_contudo, (err, query_result) => {
                console.log("[!] trabalho editado codigo: "+req.body.codigo)
                
                if(req.files != ""){
                    var count_files = req.files.length
                    var counter_files = 0;
                    
                    req.files.forEach(file => {
                        var salva_anexo = "INSERT INTO moodle_anexos"
                        salva_anexo += " VALUES("
                        salva_anexo += " DEFAULT,"
                        salva_anexo += " '"+file.path+"',"
                        salva_anexo += " '"+file.originalname+"',"
                        salva_anexo += " '"+file.filename+"',"
                        salva_anexo += " NULL,"
                        salva_anexo += " '"+req.body.codigo+"'"
                        salva_anexo += " )"
                        pool.query(salva_anexo, (err, query_result) => {
                            console.log(salva_anexo)
                            counter_files++
                            if(counter_files==count_files){
                                res.redirect("/professor/trabalhos")
                            }
                        })
                    })
                }else{
                    res.redirect("/professor/trabalhos")
                }
            })

        })

    }
    const trabalho_delete = (req,res) => {

        var del_trabalho = "delete from moodle_trabalhos"
        del_trabalho += " where mot_codigo='"+req.body.codigo+"'"

        pool.query(del_trabalho, (err, query_result) => {
            res.status(200)
            res.send(err)
        })

    }
    const trabalho_anexo_delete = (req,res,fs) => {
        fs.unlink(req.body.anexo, (err) => {
            if (err) {
                var delete_anexo = "DELETE FROM moodle_anexos";
                delete_anexo += " WHERE moa_codigo = '"+req.body.anexo+"'";
                delete_anexo += " RETURNING moa_motcod";
                pool.query(delete_anexo, (err, query_result) => {
                    var anexosExists = "SELECT count(*) from moodle_anexos"
                    anexosExists += " where moa_motcod = '"+query_result.rows[0].moa_motcod+"'"
                    pool.query(anexosExists, (err, query_result2) => {
                        if(query_result2.rows[0].count == 0){
                            var updateAnexosConteudos = "UPDATE moodle_trabalho"
                            updateAnexosConteudos += " SET mot_anexos='f' "
                            updateAnexosConteudos += "where mot_codigo='"+query_result.rows[0].moa_motcod+"' "
                            pool.query(anexosExists, (err, query_result3) => {
                                res.status(200).send("OK")
                            })
                        }else{
                            res.status(200).send("OK")
                        }
                    })
                })
            }else{
                res.status(404).send(err)
            }
        })
    }
/* #END# Trabalho */

/* #START# Avaliacao */
    const avaliacao_select = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "avaliacoes",
            avaliacoes: [],
            anexos: []
        }

        res.render('contents/professor/avaliacoes', metadata) 

    }
    const avaliacao_select2 = (req,res) => {

        const metadata = {
            user: {
                name: req.session.name, 
                codigo: req.session.codigo, 
                nivel: req.session.nivel 
            }, 
            active: "avaliacoes",
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

                res.render('contents/professor/avaliacoes_adicionar', metadata)

            })

        })

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

/* #START# Chat */
    const chat_insert = (data) => {

    }
    const chat_select = (data) => {
        
    }
    const chat_update = (data) => {
        
    }
    const chat_delete = (data) => {
        
    }

/* #END# Chat */


module.exports = {
    "login_select": login_select,
    "login_insert": login_insert,
    "login_list": login_list,

    "conteudo_select": conteudo_select,
    "conteudo_select2": conteudo_select2,
    "conteudo_select3": conteudo_select3,
    "conteudo_select4": conteudo_select4,
    "conteudo_select5": conteudo_select5,
    "conteudo_select6": conteudo_select6,
    "conteudo_insert": conteudo_insert,
    "conteudo_update": conteudo_update,
    "conteudo_delete": conteudo_delete,
    "conteudo_anexo_delete": conteudo_anexo_delete,

    "trabalho_select": trabalho_select,
    "trabalho_select2": trabalho_select2,
    "trabalho_select3": trabalho_select3,
    "trabalho_select4": trabalho_select4,
    "trabalho_select5": trabalho_select5,
    "trabalho_select6": trabalho_select6,
    "trabalho_insert": trabalho_insert,
    "trabalho_update": trabalho_update,
    "trabalho_delete": trabalho_delete,
    "trabalho_anexo_delete": trabalho_anexo_delete,

    "avaliacao_select": avaliacao_select,
    "avaliacao_select2": avaliacao_select2,
    "avaliacao_insert": avaliacao_insert,
    "avaliacao_update": avaliacao_update,
    "avaliacao_delete": avaliacao_delete,

    "log_select": log_select,
    "log_insert": log_insert,
    "log_delete": log_delete,

    "chat_insert": chat_insert,
    "chat_select": chat_select,
    "chat_update": chat_update,
    "chat_delete": chat_delete
    
}
