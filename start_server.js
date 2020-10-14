//system requires
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs')

//custom requires
const postgress_manager = require('./configs/postgress_manager')                  
const socket_manager = require('./configs/socket_manager')(io, postgress_manager)
const multer_manager = require('./configs/multer_manager')                     

//Middlewares
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: "123123123123", resave: true, saveUninitialized: true}));

//Routes
const indexroute = require('./routes/indexroute')(app,postgress_manager)
const homeroute = require('./routes/homeroute')(app,postgress_manager)
const conteudosroute = require('./routes/conteudosroute')(app,postgress_manager,multer_manager)
const trabalhosroute = require('./routes/trabalhosroute')(app,postgress_manager,multer_manager)
const chatsroute = require('./routes/chatsroute')(app,postgress_manager,multer_manager)
const avaliacoesroute = require('./routes/avaliacoesroute')(app,postgress_manager,multer_manager)
const relatoriosroute = require('./routes/relatoriosroute')(app,postgress_manager)
const otherroutes = require('./routes/otherroutes')(app,postgress_manager,fs)
const usuariosroute = require('./routes/usuariosroute')(app,postgress_manager)

//Startup
const port = 3000
http.listen(port, () => {
  console.log('[!] Server started at: http://localhost:'+port)
})