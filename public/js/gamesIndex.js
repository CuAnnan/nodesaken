function submitGameDetails()
{
    let data = {
        name:$('#gameName').val(),
        description:$('#gameDescription').val(),
        public:$('input[name=gamePublic]:checked').val()
    };
    $.post(
        '/games/new',
        data,
        (data)=>{
            showGameCommands(data.reference);
        }
    );
}

function showGameCommands(reference)
{
    console.log(reference);
    $('.gameCommandReference').text(reference);
    $('#gameDetailsModal').modal('show');
}

(function($){
    $(function(){
        $('#newGameButton').click(()=>{$('#newGameModal').modal('show');});
        $('#createGameButton').click(submitGameDetails);
        $('.gameCommands').click(function(){showGameCommands($(this).closest('.row').data('reference'))});
    });
})(window.jQuery);