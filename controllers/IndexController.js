'use strict';
let Controller = require('./Controller');

class IndexController extends Controller
{
    static async indexAction(req, res, next)
    {
        res.render('index', { title: 'Nodesaken' });
    }

    static async botPageAction(req, res, next)
    {
        let user = await Controller.getLoggedInUser(req);
        res.render('bot', {user:user});
    }


}

module.exports = IndexController;