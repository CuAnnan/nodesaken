let ForsakenCharacter = require('./Forsaken/ForsakenCharacter'),
	Merit = require('./Merit'),
	toon, characterReference,
	MeritsDatabase = require('./MeritsDatabase');

(function($) {
	$.fn.textfill = function(maxFontSize) {
		maxFontSize = parseInt(maxFontSize, 10);
		return this.each(function(){
			var ourText = $("span", this),
				parent = ourText.parent(),
				maxHeight = parent.height(),
				maxWidth = parent.width(),
				fontSize = parseInt(ourText.css("fontSize"), 10),
				multiplier = maxWidth/ourText.width(),
				newSize = (fontSize*(multiplier-0.1));
			ourText.css(
				"fontSize",
				(maxFontSize > 0 && newSize > maxFontSize) ?
					maxFontSize :
					newSize
			);
		});
	};
})(jQuery);

window.debugToon = ()=>{
	console.log(toon);
};

window.getToon = () =>{
	return toon;
};

function saveCharacter()
{
	let xhrData = {
		name:toon.name,
		blood:toon.blood,
		bone:toon.bone,
		concept:toon.concept,
		auspice:toon.auspice,
		tribe:toon.tribe,
		json:toon.toJSON(),
		timestamp:Date.now(),
	};
	return $.post(
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
		/*
		 * UI Event handlers
		 */
		let $modal = $('#loadingModal').modal(),
			$meritModal = $('#meritsModal');
		$('[data-toggle="tooltip"]').tooltip();
		$('#harmony span').click(setHarmony);
		$('.meritName').click(loadMeritDialog);
		$('.meritValue i').click(setMeritLevel);
		$('.renown i').click(setRenownLevel);
		$('.xpPurchasableValue span').click(setValue);
		$('#cancelMeritButton').click(()=>{
			$meritModal.modal('hide');
		});
		$('#primalUrge i').click(setPrimalUrge);
		$('#addShadowGiftsButton').click(showShadowGiftSelector);
		$('#giftsModalChooseBtn').click(chooseGift);
		$('#myTab a').on('click', function (e) {
			$(this).tab('show');
		});
		$('.giftFacetDelete').click(removeGiftFacet);
		$('.auspiceSkill').click(setFavouredAuspiceSkill);
		$('.skillName').click(showSpecialtyModal);
		$('#specialityModalNewButton').click(addSpecialty);
		$('.deleteFacetLink').click(removeGiftFacet)
		/*
		 Instantiate a new character
		 The load order of toon and merits is currently tightly coupled
		 This is a problem.
		 But it is a fix-later problem.
		 */
		toon = new ForsakenCharacter({
			name:$('#characterName').text(),
			auspice:$('#characterAuspice').text(),
			tribe:$('#characterTribe').text(),
			reference:$('#characterDetails').data('reference')
		});
		
		toon.primalUrge.loadJSON($('#primalUrge').data());
		
		MeritsDatabase.setToon(toon);
		let meritsPromise = MeritsDatabase
				.loadRemote()
				.then(()=>{
					MeritsDatabase.update();
				}),
			giftsPromise = $.get('/js/GiftsDB/Forsaken.json')
				.then(
					(data)=>{
						let json = JSON.parse(data);
						toon.loadShadowGiftsJSON(json.shadow);
					}
				);
		Promise.all([meritsPromise, giftsPromise]).then(
			()=>
			{
				let jsonString = $('#toonJSON').html(),
					json = JSON.parse(jsonString);
				
				toon.loadJSON(json.json);
				$modal.modal('hide');
				updateDerivedUIFields();
			}
		);
	});
})();

function setFavouredAuspiceSkill()
{
	let $node = $(this),
		$row = $node.closest('.row'),
		skillName = $row.data('name'),
		$skillsContainer = $('.skillsCol');
	
	$('.auspiceSkill.fas').removeClass('fas').addClass('far');
	
	toon.favouredAuspiceSkill = skillName;
	$node.removeClass('far').addClass('fas');
	for(let skill of toon.auspiceSkills)
	{
		let $skillRow = $skillsContainer.find(`[data-name="${skill}"]`),
			$scoreContainer = $('.xpPurchasableValue', $skillRow),
			score = toon.lookups[skill].score;
		$('i', $scoreContainer).removeClass('fas far').each(
			(i, node)=>{
				$(node).addClass(i < score ? 'fas' : 'far');
			}
		);
	}
	saveCharacter();
}

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
	$('.meritValue i', $row)
		.removeClass('far fas')
		.each(
			(index, element)=>{
				$(element).addClass(newScore > index ? 'fas':'far');
			}
		);
	saveCharacter();
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
	
	$('#essence i').removeClass('fas far').each((index, element)=>{
		$(element).addClass(toon.essenceMax > index ? 'far' : 'fas');
	});
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
			try
			{
				for(let i of merit.levels)
				{
					let dotsString = '';
					for(let j = 0; j < i; j++)
					{
						dotsString += '•';
					}
					dots.push(dotsString);
				}
			}
			catch(e)
			{
				console.log(merit);
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

function setPrimalUrge()
{
	let $node = $(this), $primalUrge = $('#primalUrge'), score = $node.parent().data('score');
	toon.primalUrge.score = score;
	toon.calculateDerived();
	$('i', $primalUrge)
		.removeClass('fas far')
		.each((index, element)=>{
			$(element).addClass(score > index ? 'fas' : 'far');
		});
	
	updateDerivedUIFields();
	saveCharacter();
}

function setRenownLevel()
{
	let $node = $(this),
		$row = $node.closest('.row'),
		$renownValue = $node.closest('.renownValue'),
		score = $node.parent().data('score'),
		renownName = $row.data('name'),
		renown = toon.getRenownByName(renownName);
	
	if(score <= renown.getFreeLevels())
	{
		score = renown.getFreeLevels();
	}
	else if (score == renown.score)
	{
		score --;
	}
	renown.score = score;
	
	$('i', $renownValue).removeClass('fas far').each(
		(i, node)=>{
			$(node).addClass(i < score ? 'fas' : 'far');
		}
	);
	saveCharacter();
}

function showShadowGiftSelector()
{
	let gifts = toon.availableShadowGifts;
	populateAndShowGiftsUI('shadow', gifts);
}

function populateAndShowGiftsUI(listName, gifts)
{
	let $affinityGifts = $('#giftsModalAffinityGifts').empty(),
		$nonAffinityGifts = $('#giftsModalNonAffinityGifts').empty();
	for(let gift of gifts)
	{
		for(let facet of gift.availableFacets)
		{
			$('<option/>')
				.text(`${gift.shorthand} (${facet.renown}) - ${facet.name}`)
				.appendTo(
					gift.affinity ? $affinityGifts : $nonAffinityGifts
				).data({
					'list':listName,
					'gift':gift.shorthand,
					'renown':facet.renown
				});
		}
	}
	$('#giftsSelectorModal').modal('show');
}

function chooseGift()
{
	let $chosenGift = $('#giftsModalGift option:selected'),
		giftData = $chosenGift.data();
	
	toon.unlockFacet(giftData.list, giftData.gift, giftData.renown);
	updateGiftFacets();
	$('#giftsSelectorModal').modal('hide');
	saveCharacter();
}

function removeGiftFacet(e)
{
	e.preventDefault();
	let $element = $(this),
		$row = $element.closest('.giftFacet'),
		data = $row.data();
	toon.removeGiftFacet(data.list, data.gift, data.renown);
	updateGiftFacets();
	saveCharacter();
}

function updateGiftFacets()
{
	$('.giftFacet').html('&nbsp;');
	let shadowFacets = toon.firstTenShadowFacets;
	$('#firstTenShadowGiftFacets .giftFacet').each(
		function(index, element)
		{
			if(shadowFacets[index])
			{
				let facet = shadowFacets[index],
					$element = $(element);
				$element
					.empty()
					.data({
						'gift':facet.giftList,
						'renown':facet.renown,
						'name':facet.name,
						'list':'shadow'
					})
					.append($('<div class="col-11"/>').text(`${facet.giftList} (${facet.renown}) - ${facet.name}`))
					.append($('<div class="col-1">[<a href="#" class="giftFacetDelete" title="Remove Facet">x</a>]</div>'));
				$('.giftFacetDelete', $element).click(removeGiftFacet);
			}
		}
	);
}

function showSpecialtyModal()
{
	let $element = $(this),
		$row = $element.closest('.row'),
		skillName = $row.data('name');
	updateSkillSpecialties(skillName);
	$('#specialtyModalNewSpecialty').val('');
	$('#specialtySkillName').text(skillName);
	$('#specialtyModal').modal('show');
}

function addSpecialty()
{
	let specialtyName = $('#specialtyModalNewSpecialty').val(),
		skill = $('#specialtySkillName').text(),
		$skillsContainer = $('.skillsCol'),
		$skillRow = $skillsContainer.find(`[data-name="${skill}"]`);
	
	toon.addSkillSpecialty(skill, specialtyName);
	updateSkillSpecialties(skill);
	
	$('#specialtyModalNewSpecialty').val('');
	$('.skillName', $skillRow).text(`${skill}*`);
	
	saveCharacter();
}

function updateSkillSpecialties(skill)
{
	let $modalBody = $('#specialtyModalBody').empty(),
		specialties = toon.getSkillSpecialties(skill);
	
	for(let specialty of specialties)
	{
		let $row = $(
				`<div class="row" data-specialty="${specialty}" data-skill="${skill}">
					<div class="col-9 specialtyName">${specialty}</div>
					<div class="col-3">
						<button class="btn btn-secondary editSpecialtyButton"><i class="fas fa-edit"></i></button>
						<button class="btn btn-danger deleteSpecialtyButton"><i class="fas fa-trash"></i></button>
					</div>
				</div>
				`
			).appendTo($modalBody);
	}
	$('.editSpecialtyButton').click(editSpecialty);
}

function editSpecialty()
{
	let $row = $(this).closest('.row'),
		data = $row.data(),
		$specialtyNode = $('.specialty', $row);
	$('<input type="text"/>').val(data.specialty).appendTo(
		$row.empty()
	).change(
		function()
		{
			let $node = $(this);
			let newSpecialty = node.val();
			toon.replaceSpecialty(data.skill, data.specialty, newSpeciatly);
			$row.empty().text(newSpecialty);
		}
	);
	saveCharacter();
}