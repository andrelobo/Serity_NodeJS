var codigo_id = null

$('a.conteuddo_deletar').click(function() {
    codigo_id = $(this).data("id")
});


$('a.conteuddo_deletar').confirm({
    title: '<i class="material-icons">warning</i>Deletar?',
    content: 'Tem certesa que deseja deletar esse conteudo?<br>(Não sera possivel recupera-lo apos exclusão)',
    buttons: {
        deletar: function () {
            $.post("/professor/conteudos/deletar", {codigo: codigo_id}, function(result){
                $.confirm({
                    content: 'Conteudo deletado com sucesso',
                    autoClose: 'ok|5000',
                    buttons: {
                        ok: {
                            text: 'OK',
                            action: function () {
                                location.href = "/professor/conteudos"
                            }
                        }
                    }
                 });
                
            });
        },
        cancelar: function () {
            $.alert('Canceled!');
        }
    }
});