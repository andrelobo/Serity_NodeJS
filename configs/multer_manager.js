
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        var extencion = file.originalname.split(".")[1]
        cb(null, file.fieldname + '-' + Date.now() + "-"+ req.session.codigo + "." + extencion)
    }
})
const upload = multer({ storage: storage })

module.exports = upload