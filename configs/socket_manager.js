
const socket_manager = (io) => {
    io.on("connection", function (client) {
        console.log("[!] New Connection")
    });
}

module.exports = socket_manager