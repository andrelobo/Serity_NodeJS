$('a.conteuddo_deletar').confirm({
        title: '<i class="material-icons">warning</i>Deletar?',
        content: 'Tem certesa que deseja deletar esse conteudo?<br>(Não sera possivel recupera-lo apos exclusão)',
        buttons: {
            deletar: function () {
                $.alert('Confirmed!');
            },
            cancelar: function () {
                $.alert('Canceled!');
            }
        }
    });

//href="/professor/conteudos/deletar?codigo=<%- conteudo.codigo %>" 