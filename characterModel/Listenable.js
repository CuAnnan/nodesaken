class Listenable
{
	constructor()
	{
		this.listeners = {};
	}
	
	addEventListener(type, handler)
	{
		if(!this.listeners[type])
		{
			this.listeners[type] = [];
		}
		this.listeners[type].push(handler);
	}
	
	removeEventListener(type, handler)
	{
		if(typeof this.listeners == 'undefined')
		{
			return;
		}
		if(!this.listeners[type])
		{
			return;
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
		return;
	}
	
	triggerEvent(type)
	{
		for(let listenerCallback of this.listeners[type])
		{
			listenerCallback(type, this);
		}
	}
	
	trigger(type)
	{
		return this.triggerEvent(type);
	}
}

module.exports = Listenable;