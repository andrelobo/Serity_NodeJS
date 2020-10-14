
const otherroutes = (app,postgress_manager,fs) => {

    app.get('/download', function(req, res){
        const file = req.query.file;
        const as_file = req.query.asfile;
        res.download(file, as_file);    
    });
    
    app.post('/professor/anexo/deletar', function(req, res){
        if(req.body.type == "consteudo"){
            postgress_manager.conteudo_anexo_delete(req, res, fs)
        }else{
            postgress_manager.trabalho_anexo_delete(req, res, fs)
        }
    });

}

module.exports = otherroutes