
const socket_manager = (io) => {

    io.on("connection", function (socket) {
        console.log("[!] New Connection")

        socket.on("disconnect", function () {
            console.log("[!] Closed Connection");
         });

    });
    
}

module.exports = socket_manager