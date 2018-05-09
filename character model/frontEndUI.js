let Character = require('./character'),
	toon = new Character();

window.debugToon = ()=>{
	console.log(toon);
}

window.getToon = () =>{
	return toon;
};

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
		
	}
	catch(e)
	{
		console.log(e);
	}
	
}


(()=>{
	$(()=>{
		$('.xpPurchasable').each(
			function(index, node)
			{
				let $node = $(node);
				let data = $node.data();
				toon.lookups[data.name].levels = data;
			}
		);
		$('.xpPurchasableValue span').click(setValue);
	});
})();