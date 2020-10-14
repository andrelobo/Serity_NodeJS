var anexo_codigo = null
var anexo_div = null

$('button.delete-anexo').click(function() {
    anexo_codigo = $(this).attr("data-codigo")
    anexo_div = $(this).attr("data-div")
});


$('button.delete-anexo').confirm({
    title: '<i class="material-icons">delete_forever3</i>Deletar?',
    content: 'Tem certesa que deseja deletar esse anexo?<br>(NÃ£o sera possivel recupera-lo apos exclusÃ£o)',
    buttons: {
        deletar: function () {
            $.post("/professor/anexo/deletar", {anexo: anexo_codigo, user: user_data, type: "trabalho"}, function(result){
                $("label").remove(".anexo"+anexo_div);
                $("br").remove(".anexo"+anexo_div);
                if($('label[class^="anexo"]').length == 0 ){
                    $("div").remove(".anexos-header")
                }
            });
        },
        cancelar: function () {
            $.alert('Cancelado!<br>Anexo não deletado');
        }
    }
});