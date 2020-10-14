$('div.conteudo').click(function() {
    codigo_id = $(this).data("cod")
    location.href = "/aluno/trabalho/vizualisar?codigo="+codigo_id
});