'use strict';
class Listenable
{
	constructor()
	{
		this.listeners = {};
	}

	on(type, handler)
	{
		return this.addEventListener(type, handler);
	}

	addListener(type, handler)
	{
		return this.addEventListener(type, handler);
	}
	
	addEventListener(type, handler)
	{
		if(!this.listeners[type])
		{
			this.listeners[type] = [];
		}
		this.listeners[type].push(handler);
		return this;
	}
	
	removeEventListener(type, handler)
	{
		if(typeof this.listeners == 'undefined')
		{
			return this;
		}
		if(!this.listeners[type])
		{
			return this;
		}
		let found = false;
		for(let i = 0; i < this.listeners[type].length && !found; i++)
		{
			if(this.listeners[type][i] == handler)
			{
				this.listeners[type].splice(i, 1);
				found = true;
			}
		}
		return this;
	}
	
	triggerEvent(type)
	{
		if(this.listeners[type])
		{
			for (let listenerCallback of this.listeners[type])
			{
				listenerCallback(type, this);
			}
		}
	}
	
	trigger(type)
	{
		return this.triggerEvent(type);
	}
}

module.exports = Listenable;