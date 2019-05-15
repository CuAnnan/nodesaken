const   XPPurchasable = require('./XPPurchasable'),
        Merit = require('./Merit'),
        Listenable = require('./Listenable');

class DerivedAttribute extends Listenable
{
    constructor(name, ...parts)
    {
        super();
        this.name = name;
        this.parts = [];
        this.addParts(...parts);
        this._freeLevels = 0;
        this.baseScore = 0;
        this.upToDate = false;
    }

    addPart(part)
    {
        this.upToDate = false;
        if(isNaN(part))
        {
            if(part instanceof DerivedAttribute || part instanceof XPPurchasable)
            {
                this.parts.push(part);
                part.addEventListener('changed', ()=>{
                    console.log(part.name+ ' changed');
                    this.updateScore();
                });
            }
            else if(part instanceof Merit)
            {
                this.parts.push(part);
                part.addEventListener('changed', ()=>{this.updateScore();});
            }
            else
            {
                throw new Error('Unexpected component part in derived attribute');
            }
        }
        else
        {
            part = parseInt(part);
            this.baseScore += part;
            this.parts.push({score:part});
        }
        return this;
    }

    updateScore()
    {
        this.baseScore = 0;

        for(let part of this.parts)
        {
            let partValue = null;
            if(part instanceof Merit)
            {
                this.baseScore += part.modifier;
                partValue = part.modifier;
            }
            else
            {
                this.baseScore += part.score;
                partValue = part.score;
            }

        }
        this.upToDate = true;
    }

    addParts(...parts)
    {
        this.upToDate = false;
        for(let part of parts)
        {
            this.addPart(part);
        }
        return this;
    }

    get score()
    {
        if(!this.upToDate)
        {
            this.updateScore();
        }

        return this.baseScore + this.freeLevels;
    }

    get freeLevels()
    {
        return this._freeLevels;
    }

    set freeLevels(freeLevels)
    {
        this.upToDate = false;
        this._freeLevels = freeLevels;
        this.trigger('changed');
    }
}

module.exports = DerivedAttribute;