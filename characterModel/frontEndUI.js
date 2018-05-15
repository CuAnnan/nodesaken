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
		updateDerivedUIFields();
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
		toon.calculateDerived();
		updateDerivedUIFields();
		$('.xpPurchasableValue span').click(setValue);
		$('#myTab a').on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		});
	});
})();

function updateDerivedUIFields()
{
	$('.formAttributes').each(
		function()
		{
			let $formNode = $(this),
				form = $formNode.data('form');
			$('.formAttribute', $formNode).each(
				function(i, node)
				{
					let $attributeNode = $(node),
						modifier = parseInt($attributeNode.data('modifier')),
						attribute = $attributeNode.data('attribute');
					$attributeNode.text(toon.getPurchasable(attribute).score + modifier)
				}
			);
		}
	);
	
	$('.formDerivedAttributes').each(
		function()
		{
			let $formNode = $(this),
				form = $formNode.data('form');
			$('.size', $formNode).text(toon.size + (toon.formMods[form].mechanical.size?toon.formMods[form].mechanical.size:0));
			$('.defense', $formNode).text(toon.getDefense(form));
			$('.derivedAttribute', $formNode).each(
				function(i, node)
				{
					let $attributeNode = $(node),
						attribute = $attributeNode.data('attribute'),
						modifier = $attributeNode.data('modifier');
					if(toon.getDerivedAttribute(attribute))
					{
						modifier = modifier?parseInt(modifier):0;
						$attributeNode.text(toon.getDerivedAttribute(attribute) + modifier);
					}
				}
			);
		}
	);
}