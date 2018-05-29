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
		let $modal = $('#loadingModal').modal(),
			$meritModal = $('#meritsModal');
		$('[data-toggle="tooltip"]').tooltip();
		$('#harmony span').click(setHarmony);
		$('.meritName').click(loadMeritDialog);
		$('.xpPurchasableValue span').click(setValue);
		$('#cancelMeritButton').click(()=>{
			$meritModal.modal('hide');
		});
		
		toon = new ForsakenCharacter({
			name:$('#characterName').text(),
			auspice:$('#characterAuspice').text(),
			tribe:$('#characterTribe').text(),
			reference:$('#characterDetails').data('reference')
		});
		
		MeritsDatabase.setToon(toon);
		
		$('.xpPurchasable').each(function (index, node){
			let $node = $(node), data = $node.data();
			toon.lookups[data.name].loadJSON(data);
		});
		toon.calculateDerived();
		updateDerivedUIFields();
		
		
		$('#myTab a').on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
		
		let meritDBFiles = [
				'ChroniclesOfDarkness.json',
				'13Precinct.json',
				'HurtLocker.json',
				'DarkEras.json',
				'Forsaken.json',
				'ThePack.json',
			],
			requests = [];
		
		for(let i of meritDBFiles)
		{
			MeritsDatabase.addToOrder(i);
			requests.push(
				$.get(`/js/MeritDB/${i}`).then((data)=>{MeritsDatabase.load(JSON.parse(data), i);})
			);
		}
		
		Promise.all(requests).then(()=>{
			$modal.modal('hide');
			MeritsDatabase.update();
		}).catch((err)=>{
			console.log(err);
		})
		
	});
})();

function updateDerivedUIFields()
{
	let hAndW = ['health', 'willpower'],
		cAndM = ['Current', 'Max'];
	
	for(let i of hAndW)
	{
		for(let j of cAndM)
		{
			$(`#${i}${j} .healthLevel i`).each(
				function (index, node)
				{
					let $node = $(node).removeClass('fas far'),
						higher = j == 'Current'?'far':'fas',
						lower = j == 'Current'?'fas':'far',
						className = toon.derivedAttributes[i] > index ? higher : lower;
					$node.addClass(className);
				}
			);
		}
	}
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
		orderedMerits = MeritsDatabase.listAvailable(),
		index = $node.data('index'),
		chosenMerit = null,
		$meritSpecification = $('#meritSpecification');
	$select.append(
		$('<option value="">--Choose one --</option>')
	);
	
	$select.change(function(){
		let meritName = $select.val();
		chosenMerit = meritName?MeritsDatabase.fetch(meritName):null;
		if(!chosenMerit)
		{
			return;
		}
		if(chosenMerit.specific)
		{
			$('#specificMerit').css('display', 'flex');
		}
	});
	
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
	$('#addMeritButton').unbind().click(()=>{
		if(chosenMerit.specific)
		{
			chosenMerit.setSpecification($meritSpecification.val());
		}
		console.log(chosenMerit);
	});
}

function setHarmony()
{
	let $node = $(this), $harmony = $('#harmony');
	toon.morality = $node.data('score');
	$('i', $harmony).removeClass('fas far').each(
		(i, node)=>{
			$(node).addClass(i < toon.morality ? 'fas' : 'far');
		}
	);
	saveCharacter();
}