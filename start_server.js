//requires
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

//configs
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
const port = 3000

//Routes
const indexroute = require('./routes/indexroute')(app)
const homeroute = require('./routes/homeroute')(app)

//Socket.io
const socket_manager = require('./configs/socket_manager')(io)

//Startup
http.listen(port, () => {
  console.log('[!] Server started at: http://localhost:'+port)
})