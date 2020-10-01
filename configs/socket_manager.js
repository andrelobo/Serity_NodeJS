

const socket_manager = (io, postgress_manager) => {

    io.on("connection", function (socket) {
        console.log("[!] New Connection")

        socket.on("online", function (data) {
            io.in(data.cla_turma).emit("online",data.user_name);
        });

        socket.on("new_conteudo", function (data) {
            io.in(data.cla_turma).emit("notification","Novo conteudo de "+data.materia+": "+data.titulo);
        });

        socket.on("new_trabalhos", function (data) {
            io.in(data.cla_turma).emit("notification","Novo conteudo de "+data.materia+": "+data.titulo);
        });

        socket.on("new_mensage", function (data) {
            io.in(data.user_dest).emit("chat_dialog",data.msg);
        });

        socket.on("new_avaliacao", function (data) {
            io.in(data.cla_turma).emit("notification","Nova avaliacao de "+data.materia+": "+data.titulo);
        });

        socket.on("save_skin", function (data) {
            console.log(JSON.stringify(data))
        });

    });
    
}

module.exports = socket_manager