var $newWerewolfModal, $newWerewolfName,$newWerewolfTribe, $newWerewolfAuspice;

function newWerewolf()
{
	let requestData = {
		name:$newWerewolfName.val(),
		auspice:$newWerewolfAuspice.val(),
		tribe:$newWerewolfTribe.val()
	};
	console.log(requestData);
	
	$.post(
		'/characters/new',
		requestData
	).then(
		function(data)
		{
			console.log(data);
		}
	);
	return false;
}

function loadCharacter(characterReference)
{
	window.location.replace('/characters/fetch/'+characterReference);
}

(function($){
	$(function(){
		$newWerewolfModal = $('#newWerewolfModal');
		$newWerewolfName = $('#newWerewolfName');
		$newWerewolfTribe = $('#newWerewolfTribe');
		$newWerewolfAuspice = $('#newWerewolfAuspice');
		$('#newWerewolfButton').click(function()
		{
			$newWerewolfModal.modal();
		});
		$('#newWerewolfDetails').submit(function(){
			newWerewolf();
			return false;
		});
		$('.loadCharacter').click(function(){
			loadCharacter($(this).data('characterReference'));
		});
		$('.deleteCharacter').click(function(){
		
		});
	});
})(window.jQuery);