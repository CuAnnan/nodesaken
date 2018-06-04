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

/**
 * IIFE to bind all events, load the character from the data attributes and handle all event stuff
 */
(()=>{
	$(()=>{
		let $modal = $('#loadingModal').modal(),
			$meritModal = $('#meritsModal');
		$('[data-toggle="tooltip"]').tooltip();
		$('#harmony span').click(setHarmony);
		$('.meritName').click(loadMeritDialog);
		$('.meritValue i').click(setMeritLevel);
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
		
		$('#myTab a').on('click', function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
		
		MeritsDatabase.loadRemote().then(()=>{
			$modal.modal('hide');
			
			$('.merit').each(function(index, node){
				let $node = $(node),
					data = $node.data();
				if(data.name)
				{
					let merit = MeritsDatabase.fetch(data.name);
					toon.addMerit(index, merit);
					merit.loadJSON(data);
					toon.calculateDerived();
				}
			});
			MeritsDatabase.update();
			updateDerivedUIFields();
			
		}).catch((err)=>{
			console.log(err);
		});
	});
})();

function setMeritLevel()
{
	let $node = $(this),
		$parent = $node.parent(),
		$row = $node.closest('.row'),
		rowData = $row.data(),
		score = $parent.data('score');
	
	let merit = toon.getMerit(rowData.index);
	if(merit.levels.length == 1)
	{
		return;
	}
	
	let currentMeritLevelIndex = merit.levels.indexOf(merit.score),
		newScore;
	
	if((score < merit.score && currentMeritLevelIndex == 0) || (score > merit.score && currentMeritLevelIndex == merit.levels.length - 1))
	{
		// you can't have a zero level merit or a merit of higher level than its max so fuck off
		return;
	}
	else if(score > merit.score)
	{
		// find the lowest merit level that is greater than or equal to the new score and set that to be the newest level
		let levelFound= false;
		for(let i = 0; i < merit.levels.length && !levelFound; i++)
		{
			if(merit.levels[i] >= score)
			{
				levelFound = true;
				newScore = merit.levels[i];
			}
		}
		if(!levelFound)
		{
			newScore = merit.levels[merit.levels.length - 1];
		}
	}
	else
	{
		// find the highest merit level that is less than or equal to the new score and set that to be the newest level
		let levelFound = false;
		for(let i = merit.levels.length - 1; i >= 0 && !levelFound; i--)
		{
			if(merit.levels[i] <= score)
			{
				levelFound = true;
				newScore = merit.levels[i];
			}
		}
		if(!levelFound)
		{
			newScore = merit.levels[0];
		}
	}
	
	merit.score = newScore;
	$row.data('score', merit.score);
	$('.meritValue i', $row).each(
		(index, element)=>{
			$(element)
				.removeClass('far fas')
				.addClass(newScore > index ? 'fas':'far');
		}
	);
}

function updateDerivedUIFields()
{
	let hAndW = ['health', 'willpower'],
		cAndM = ['Current', 'Max'];
	/*
	 * Set up the empty circles and boxes.
	 */
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
			let $formNode = $(this), form = $formNode.data('form');
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
					if(attribute != 'defense')
					{
						if (toon.getDerivedAttribute(attribute))
						{
							modifier = modifier ? parseInt(modifier) : 0;
							$attributeNode.text(toon.getDerivedAttribute(attribute) + modifier);
						}
					}
					else
					{
						$attributeNode.text(toon.getDefense(form));
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
		$row = $node.closest('.merit'),
		rowData = $row.data(),
		$select = $('#meritChoice').empty().append($('<option value="">--Choose one --</option>')),
		$meritModal = $('#meritsModal'),
		orderedMerits = MeritsDatabase.listAvailable(),
		index = rowData.index,
		chosenMerit = null,
		$meritSpecification = $('#meritSpecification').val(''),
		$specificMerit = $('#specificMerit').css('display', 'none'),
		currentMeritName = rowData.name,
		currentMeritSpecialisation = $row.data('specialisation');
	
	$select.change(function(){
		let meritName = $select.val();
		chosenMerit = meritName?MeritsDatabase.fetch(meritName):null;
		if(!chosenMerit)
		{
			return;
		}
		$specificMerit.css('display', chosenMerit.specific?'flex':'none');
		
	});
	
	for(let t in orderedMerits)
	{
		let $optGroup = $('<optgroup/>').attr('label', t).appendTo($select);
		for(let m in orderedMerits[t])
		{
			let merit = orderedMerits[t][m],
				dots = [];
			
			for(let i of merit.levels)
			{
				let dotsString = '';
				for(let j = 0; j < i; j++)
				{
					dotsString += '•';
				}
				dots.push(dotsString);
			}
			
			$('<option/>').text(merit.name+'('+dots.join(',')+')').appendTo($optGroup).attr('value', merit.name);
		}
	}
	
	$meritModal.modal('show');
	$('#addMeritButton').unbind().click(()=>{
		if(chosenMerit)
		{
			if(chosenMerit.specific)
			{
				let spec = $meritSpecification.val();
				chosenMerit.setSpecification(spec);
			}
			
			toon.addMerit(index, chosenMerit);
			chosenMerit.score = chosenMerit.levels[0];
			
			$meritModal.modal('hide');
			let score = chosenMerit.score;
			$('.meritValue i', $row).each(
				function(index, element)
				{
					$(element).removeClass('fas far').addClass(index < score ? 'fas' : 'far');
				}
			);
			
			$node.text(chosenMerit.displayName);
			$row.data('specialisation', chosenMerit.specialisation);
			updateDerivedUIFields();
			saveCharacter();
		}
	});
	
	$('#deleteMeritButton').css('display', currentMeritName?'block':'none').unbind().click(()=>{
		toon.removeMerit(index);
		$node.text('');
		saveCharacter();
		$meritModal.modal('hide');
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