function buildNewGameUI()
{
    $('#newWerewolfModal').modal('show');
}

function submitGameDetails()
{
    let data = {
        name:$('#').text(),
        description:$('#').text()
    }
    $.post(
        '/games/new',
        data,
        (data)=>{
            console.log(data);
        }
    );
}

(function($){
    $(function(){
        $('#newGameButton').click(buildNewGameUI);
        $('#createGameButton').click(submitGameDetails);
    });
})(window.jQuery);