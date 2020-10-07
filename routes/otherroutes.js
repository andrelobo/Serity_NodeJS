
const otherroutes = (app,postgress_manager) => {

    app.get('/download', function(req, res){
        const file = req.query.file;
        const as_file = req.query.asfile;
        res.download(file, as_file);    
    });

}

module.exports = otherroutes