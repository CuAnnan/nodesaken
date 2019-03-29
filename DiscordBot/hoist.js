'use strict';
const   Discord = require('discord.js'),
        client = new Discord.Client(),
        clientToken = 'NTI4MDA0MTc2MTIzNTI3MTc5.Dwb91g.8Sj1ydMTdihaZ46lGnMXK8iFXw0',
        DieBot = require('./NSCoDDieBot');
let     dieBot = null;

console.log('Trying to hoist the bot');

client.login(clientToken);
client.once('ready',()=>{
    console.log('Instantiating the die bot');
    dieBot = new DieBot();
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

module.exports = dieBot;