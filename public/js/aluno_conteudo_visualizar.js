$('div.conteudo').click(function() {
    codigo_id = $(this).data("cod")
    location.href = "/aluno/conteudo/vizualisar?codigo="+codigo_id
});