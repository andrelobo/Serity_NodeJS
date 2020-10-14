
const multer = require('multer');

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        var extencion = file.originalname.split(".")[1]
        cb(null, file.fieldname + "-" + randomInt(1,9999) + '-' + Date.now() + "-"+ req.session.codigo + "." + extencion)
    }
})

const upload = multer({ storage: storage })

module.exports = upload