var qtd_questions = 1

$('button.add-quest').click(function() {
    qtd_questions++
    $('div.quest-list').append('new question nº'+qtd_questions+"<br>")
});