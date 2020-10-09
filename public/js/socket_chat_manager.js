$(function() {
    
    const socket = io();

    $('.right-sidebar .demo-choose-skin li').on('click', function () {
        socket.emit('save_skin', $(this).data("theme"));
    });

    socket.on("identifier", function(msg) {
        socket.emit("indentifier", user_data)
    });

    socket.on("ready", function(msg) {
        socket.emit("getOnlineUsers")
    });

    socket.on("onlineUsers", function(msg) {
        
        var obj = JSON.parse(msg);

        var result = jQuery.parseJSON(msg);
        for(var k in result) {
            console.log(result[k].user.name);
            $( ".list-users" ).append('<li class="list-group-item">'+result[k].user.name+'</li>');
         }
    });

    socket.on("updateOnlineUsers", function(msg) {
        
        

    });

});