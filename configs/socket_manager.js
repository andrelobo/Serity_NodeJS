
var currentConnections = {};
var currentConnectionsCounter = 0;

const socket_manager = (io, postgress_manager) => {

    io.on("connection", function (socket) {
        socket.emit("identifier", "-")

        socket.on("indentifier", function (data) {
            currentConnectionsCounter++
            currentConnections[socket.id] = {user: data};
            console.log("[!] usuario: "+data.name+" entrou")
            console.log("[!] onlines: "+currentConnectionsCounter)
            io.sockets.emit("user_online",currentConnections[socket.id].user)
            socket.emit("ready")
        });

        socket.on("save_skin", function (data) {
            console.log(JSON.stringify(data))
        });

        socket.on("getOnlineUsers", function () {
            socket.emit("onlineUsers", JSON.stringify(currentConnections))
        });

        socket.on("disconnect", function(){
            console.log("[!] usuario: "+currentConnections[socket.id].user.name+" saiu");
            io.sockets.emit("user_offline",currentConnections[socket.id].user)
            currentConnectionsCounter--
            delete currentConnections[socket.id];
            console.log("[!] onlines: "+currentConnectionsCounter)
        });

    });
    
}

module.exports = socket_manager