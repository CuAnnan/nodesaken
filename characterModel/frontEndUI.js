let ForsakenCharacter = require('./ForsakenCharacter'),
	Merit = require('./Merit'),
	toon, characterReference,
	MeritsDatabase = require('./MeritsDatabase');

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
		let $modal = $('#loadingModal').modal({keyboard:false});
		
		$('#addMeritButton').click(addMerit);
		
		toon = new ForsakenCharacter({
			name:$('#characterName').text(),
			auspice:$('#characterAuspice').text(),
			tribe:$('#characterTribe').text(),
			reference:$('#characterDetails').data('reference')
		});
		
		MeritsDatabase.setToon(toon);
		
		$('.xpPurchasable').each(
			function(index, node)
			{
				let $node = $(node);
				let data = $node.data();
				toon.lookups[data.name].loadJSON(data);
			}
		);
		
		
		$('.meritName').click(loadMeritDialog);
		toon.calculateDerived();
		updateDerivedUIFields();
		
		$('.xpPurchasableValue span').click(setValue);
		$('#myTab a').on('click', function (e) {
			e.preventDefault()
			$(this).tab('show')
		});
		
		let meritDBFiles = [
			'ChroniclesOfDarkness.json',
			'Forsaken.json',
			'HurtLocker.json',
			'ThePack.json',
			'DarkEras.json',
			'13Precinct.json'
		];
		
		let requests = [];
		for(let i of meritDBFiles)
		{
			requests.push(
				$.get(`/js/MeritDB/${i}`).then((data)=>{
					MeritsDatabase.load(JSON.parse(data), i);
				})
			);
		}
		
		Promise.all(requests).then(()=>{
			$modal.modal('hide');
		}).catch((err)=>{
			console.log(err);
		})
		
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

window.getMeritsDB = function()
{
	return MeritsDatabase;
}

function loadMeritDialog()
{
	let $node= $(this),
		$select = $('#meritChoice').empty(),
		$meritModal = $('#meritsModal'),
		orderedMerits = MeritsDatabase.listAvailable();
	$select.append(
		$('<option value="">--Choose one --</option>')
	);
	
	for(let t in orderedMerits)
	{
		let $optGroup = $('<optgroup/>').attr('label', t).appendTo($select);
		for(let m in orderedMerits[t])
		{
			let merit = orderedMerits[t][m];
			
			$('<option/>').text(merit.name).appendTo($optGroup).attr('value', merit.name);
		}
	}
	$meritModal.modal('show');
}

function addMerit()
{
	let meritName = $('#meritChoice').val();
	if(meritName)
	{
		let merit = MeritsDatabase.fetch(meritName);
		console.log(merit);
	}
}