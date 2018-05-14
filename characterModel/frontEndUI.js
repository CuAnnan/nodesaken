let ForsakenCharacter = require('./ForsakenCharacter'),
	toon, characterReference;

window.debugToon = ()=>{
	console.log(toon);
};

window.getToon = () =>{
	return toon;
};

function saveCharacter()
{
	let xhrData = {
		json:toon.toJSON(),
		timestamp:Date.now(),
	};
	$.post(
		'/characters/save',
		xhrData
	).then(
		(data)=>{
			console.log('Save request sent', data);
		}
	);
}

function setValue()
{
	let $span = $(this),
		chosenScore = $span.data('score'),
		$purchasable = $span.closest('.xpPurchasable'),
		data = $purchasable.data(),
		$scoreContainer = $span.closest('.xpPurchasableValue');
	
	try
	{
		let newScore = toon.setItemLevel(data.name, chosenScore);
		$('i', $scoreContainer).removeClass('fas far').each(
			(i, node)=>{
				$(node).addClass(i < newScore ? 'fas' : 'far');
			}
		);
		saveCharacter();
	}
	catch(e)
	{
		console.log(e);
	}
	
}


(()=>{
	$(()=>{
		
		toon = new ForsakenCharacter({
			name:$('#characterName').text(),
			auspice:$('#characterAuspice').text(),
			tribe:$('#characterTribe').text(),
			reference:$('#characterDetails').data('reference')
		});
		
		$('.xpPurchasable').each(
			function(index, node)
			{
				let $node = $(node);
				let data = $node.data();
				toon.lookups[data.name].levels = data;
			}
		);
		$('.xpPurchasableValue span').click(setValue);
		$('#myTab a').on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		});
	});
})();