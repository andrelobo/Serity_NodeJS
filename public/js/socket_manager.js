$(function() {
    
    const socket = io();

    $('.right-sidebar .demo-choose-skin li').on('click', function () {
        socket.emit('save_skin', $(this).data("theme"));
    });

    socket.on("identifier", function(msg) {
        socket.emit("indentifier", user_data)
    });

});