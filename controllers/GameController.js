"use strict";
let Controller = require('./Controller'),
    Character = require('../schemas/CharacterSchema'),
    Game = require('../schemas/GameSchema');

class GameController extends Controller
{
    static async indexAction(req, res, next)
    {
        if(req.session.user)
        {
            return GameController.displayGameIndexPage(req, res, next);
        }
        return GameController.registrationFormAction(req, res, next);
    }

    static async displayGameIndexPage(req, res, next)
    {
        let user        = await Controller.getLoggedInUser(req),
            characters  = await Character.find({owner:user}),
            gamesOwned  = await Game.find({owner:user}),
            gamesPlayed = await Game.find({characters:characters});

        res.render('games/index', {gamesOwned:gamesOwned, gamesPlayed:gamesPlayed, host:Controller.getHost(req)});
    }

    static async newGameAction(req, res, next)
    {
        try
        {
            let user = await Controller.getLoggedInUser(req),
                data = {
                    owner: user, name: req.body.name, description: req.body.description, public:req.body.public
                },
                game = await Game.create(data);

            res.json({
                success:true,
                status:'New Game Created',
                reference: game.reference,
                name:game.name,
                public:game.public
            });
        }
        catch(e)
        {
            res.json({
                succcess:false,
                error:e
            });
        }
    }
}

module.exports = GameController;