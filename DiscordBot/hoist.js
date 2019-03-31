'use strict';

const   Discord = require('discord.js'),
        client = new Discord.Client(),
        DieBot = require('./NSCoDDieBot');
let     dieBot = null;

module.exports = function(conf)
{
    console.log('Trying to hoist the bot');
    let discordBotConf = conf.discordBot;

    client.login(discordBotConf.clientToken);
    client.once('ready',()=>{
        console.log('Instantiating the die bot');
        dieBot = new DieBot(discordBotConf);
        dieBot.hoist(client);
    });
    client.on('error',(error)=>{
        console.log(error);
    });


    process.on(
        'SIGINT',
        ()=>{
            dieBot.shutdown().then(
                ()=>{
                    client.destroy();
                    process.exit();
                }
            );
        }
    );

    process.on('unhandledRejection', console.error);
};