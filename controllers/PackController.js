"use strict";
let Controller = require('./Controller');

class PackController extends Controller
{
    static async indexAction(req, res, next)
    {
        res.render('packs/index');
    }
}

module.exports = PackController;