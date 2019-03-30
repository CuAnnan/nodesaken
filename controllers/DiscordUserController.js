'use strict';
const   Controller = require('./Controller'),
        UserController = require('./UserController'),
        DiscordUser = require('../schemas/DiscordUserSchema'),
        STATUSES = {'APPROVED':'Approved', 'PENDING':'Pending','REJECTED':'Rejected'};

class DiscordUserController extends Controller
{
    static async addDiscordUserRequest(reference, discordUser)
    {
        let user = await UserController.getUserByReference(reference);
        let discordUserEntity = await DiscordUser.create({
            user: user, tag: discordUser.tag, id: discordUser.id
        });

        user.discordUsers.push(discordUserEntity);
        user.save();

        return true;
    }

    static async updateRequestStatusByReference(status, reference)
    {
        try
        {
            let discordUserEntity = await DiscordUser.findOne({'reference':reference});
            discordUserEntity.status = status;
            await discordUserEntity.save();
            return true;
        }
        catch(e)
        {
            console.log(e);
            return false;
        }
    }

    static async approveDiscordUserRequest(req, res, next)
    {
        try
        {
            await DiscordUserController.updateRequestStatusByReference(STATUSES.APPROVED, req.params.reference);
            res.json({success:true, status:STATUSES.APPROVED});
            return true;
        }
        catch(e)
        {
            console.log(e);
            res.json({success:false, status:'Error', error:e});
            return false;
        }
    }

    static async rejectDiscordUserRequest(req, res, next)
    {
        try
        {
            await DiscordUserController.updateRequestStatusByReference(STATUSES.REJECTED, req.params.reference);
            res.json({success: true, status: STATUSES.REJECTED});
            return true;
        }
        catch(e)
        {
            res.json({success:false, status:'Error', error:e});
        }
    }
}

module.exports = DiscordUserController;