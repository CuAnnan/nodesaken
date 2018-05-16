let ForsakenCharacter = require('./ForsakenCharacter'),
	Merit = require('./Merit'),
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
		let $modal = $('#loadingModal').modal({keyboard:false});
		
		$('#addMeritButton').click(addMerit);
		
		$.get('/js/mortalMerits.json')
			.then((data)=> {
				MeritsDatabase.load(JSON.parse(data));
				return $.get('/js/forsakenMerits.json');
			}).then((data)=>{
				$('#currentlyLoadingItem').text('Gifts Database');
				MeritsDatabase.load(JSON.parse(data));
				return $.get('/js/ShadowGifts.json');
			}).then((data)=>{
				$modal.modal('hide');
			});
		
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
		
		
		$('.meritName').click(loadMeritDialog);
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

function loadMeritDialog()
{
	let $node= $(this),
		$select = $('#meritChoice').empty(),
		$meritModal = $('#meritsModal'),
		orderedMerits = MeritsDatabase.listOrdered();
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

var MeritsDatabase = {
	data:[], searchable:{}, ordered:{},
	reset:function()
	{
		this.data = [];
	},
	load:function(data)
	{
		for(var type in data)
		{
			this.ordered[type] = [];
			for(var i in data[type])
			{
				var merit = data[type][i];
				let test = new Merit(merit.name, merit);
				this.ordered[type].push(merit);
				this.data.push(merit);
				this.searchable[merit.name] = merit;
			}
		}
	},
	list:function()
	{
		return this.data;
	},
	listOrdered:function()
	{
		return this.ordered;
	},
	fetch:function(name)
	{
		return new Merit(name, this.searchable[name]);
	}
};

function addMerit()
{
	let meritName = $('#meritChoice').val();
	if(meritName)
	{
		let merit = MeritsDatabase.fetch(meritName);
		console.log(merit);
	}
}