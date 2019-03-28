var $newWerewolfModal, $newWerewolfName,$newWerewolfTribe, $newWerewolfAuspice;

function newWerewolf()
{
	let requestData = {
		name:$newWerewolfName.val(),
		auspice:$newWerewolfAuspice.val(),
		tribe:$newWerewolfTribe.val()
	};
	
	$.post(
		'/characters/new',
		requestData
	).then(
		function(response)
		{
			let data = JSON.parse(response);
			loadCharacter(data.reference);
		}
	);
	return false;
}

function loadCharacter(characterReference)
{
	let url = '/characters/fetch/'+characterReference;
	window.location.replace(url);
}

function showApiKeyModal(characterReference)
{
	$.get(`/characters/getAPIKeys/${characterReference}`).then((response)=>{
		response = JSON.parse(response);
		let $list = $('#apiKeyList').empty();
		for(let key of response.apiKeys)
		{
			$('<li/>').text
		}
		$('#characterAPIKeys').modal('show');
	});

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
		$('.showApiKeys').click(function(){
			showApiKeyModal($(this).data('characterReference'));
		});

		let d = Date.now();
		let m = moment(d);
		console.log(m.format('dddd'));
	});
})(window.jQuery);