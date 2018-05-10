let modes = require('./XPPurchasableModes');

class XPPurchasable
{
	constructor(name)
	{
		this.name = name;
		this.xpLevels = 0;
		this.cpLevels = 0;
		this.min = 0;
		this.max = 5;
		this.xpCost = 0;
		this.purchaseMode = modes.CP;
		this.useGroupReference = null;
	}
	
	set useGroup(useGroupReference)
	{
		this.useGroupReference = useGroupReference;
	}
	
	loadJSON(json)
	{
		this.xpLevels = json.xpLevels;
		this.cpLevels = json.cpLevels;
	}
	
	get cost()
	{
		return {
			cp:this.cpLevels,
			xp:this.xpLevels * this.xpCost
		};
	}
	
	get score()
	{
		return this.min + this.xpLevels + this.cpLevels;
	}
	
	set levels(data)
	{
		this.xpLevels = data.xpLevels;
		this.cpLevels = data.cpLevels;
	}
	
	set purchaseMode(mode)
	{
		if(!mode === modes.XP && !mode === modes.CP)
		{
			let error = new Error('Invalid purchase mode '+mode+' supplied to purchaseMode setter');
			error.name = 'InvalidPurchaseMode';
			throw error;
		}
		this.mode = mode;
	}
	
	/**
	 * Increases or reduces the number of levels bought with CP or XP (depending on what the current purchase mode is).
	 *
	 * @param The new level to set
	 * @returns {{cp: number, xp: number}} the number of CP and/or XP this purchase costs or refunds
	 */
	set level(level)
	{
		let score = this.min + this.xpLevels + this.cpLevels;
		
		/**
		 * If you're trying to buy the level you have, and the level you have is greater than your minimum score
		 * you're trying to unpurchase the current level
		 */
		if(level === score && level > this.min)
		{
			level = level - 1;
		}
		
		let cost = {cp:0, xp:0},
			increase = level - score;
		
		if(increase == 0)
		{
			return cost;
		}
		
		if(increase > 0)
		{
			if(this.mode === modes.CP)
			{
				this.cpLevels += increase;
				cost.cp = increase;
			}
			else
			{
				let xpIncrease = (this.min + this.cpLevels),
					xpLevels = level - xpIncrease;
				
				cost.xp = (xpLevels - this.xpLevels) * this.xpCost;
				this.xpLevels = xpLevels;
			}
		}
		else
		{
			let reduction = Math.abs(increase),
				tmp = {
					xpLevels:this.xpLevels,
					cpLevels:this.cpLevels
				};
			console.log('Reduce '+this.name+' by '+reduction+' levels');
			// reduce the XP levels first
			tmp.xpLevels -= reduction;
			if(tmp.xpLevels < 0)
			{
				tmp.cpLevels += tmp.xpLevels;
				tmp.xpLevels = 0;
			}
			cost.xp = (this.xpLevels - tmp.xpLevels) * this.xpCost;
			cost.cp = this.cpLevels - tmp.cpLevels;
			this.xpLevels = tmp.xpLevels;
			this.cpLevels = tmp.cpLevels;
		}
		this.useGroupReference.update();
		return cost;
	}
}

module.exports = XPPurchasable;