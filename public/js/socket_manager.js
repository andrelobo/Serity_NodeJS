var socket = io();

$('.right-sidebar .demo-choose-skin li').on('click', function () {
    socket.emit('save_skin', $(this).data("theme"));
});