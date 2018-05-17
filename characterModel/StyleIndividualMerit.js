let Merit = require('./Merit');

class StyleIndividualMerit extends Merit
{
	constructor(name, data)
	{
		super(name, data);
		this.styleTags = data.styleTags;
	}
}

module.exports = StyleIndividualMerit;