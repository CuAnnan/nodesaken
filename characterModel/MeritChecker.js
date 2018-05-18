module.exports = {
	compare:function(toonValue, prerequisite)
	{
		let comparison = prerequisite.comparison;
		if(!toonValue)
		{
			console.log('No value found');
			console.log(prerequisite);
			return false;
		}
		if(comparison.gte)
		{
			let result = toonValue.score >= comparison.gte;
			return result;
		}
		console.log(comparison);
	},
	validates:function(toon, merit)
	{
		let result = {failurePoints:[]};
		if(merit.prerequisites)
		{
			let validates = false;
			for(let prerequisiteSet of merit.prerequisites)
			{
				let prerequisiteMet = true;
				for(let prerequisite of prerequisiteSet)
				{
					if (prerequisite.hasMerit)
					{
						console.log('Checking merit prerequisite');
						if(!toon.hasMerit(prerequisite.hasMerit))
						{
							prerequisiteMet = false;
							result.failurePoints.push('Does not have '+prerequisite.hasMerit);
						}
					}
					else if(prerequisite.any)
					{
						console.log('checking compound prerequisite');
						let partMet = false;
						let parts = [];
						for(let part of prerequisite.any)
						{
							if(this.compare(toon.lookups[part.compare], prerequisite))
							{
								partMet = true;
							}
							parts.push(part.compare);
						}
						if(!partMet)
						{
							result.failurePoints.push('Has none of '+parts.join(', ')+' at prerequisite');
							prerequisiteMet = false;
						}
						else
						{
							prerequisiteMet = true;
						}
					}
					else if(prerequisite.compare == "any")
					{
						console.log('Checking multiple matches');
						let match = false;
						for(let item of toon[prerequisite.useGroup].items)
						{
							if(this.compare(item, prerequisite))
							{
								match = true;
							}
						}
						prerequisiteMet = match;
					}
					else if(prerequisite.compare && prerequisite.comparison)
					{
						prerequisiteMet = this.compare(toon.lookups[prerequisite.compare], prerequisite);
						if(!prerequisiteMet)
						{
							result.failurePoints.push(prerequisite.compare+' not meeting ', prerequisite);
							prerequisiteMet = false;
						}
						else
						{
							prerequisiteMet = true;
						}
					}
					else
					{
						prerequisiteMet = false;
					}
					
					if(prerequisiteMet)
					{
						validates = true;
					}
				}
			}
			result.validates = validates;
			return result;
		}
		else
		{
			return {validates:true};
		}
	}
}