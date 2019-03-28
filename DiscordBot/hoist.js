'use strict';
const   Discord = require('discord.js'),
        client = new Discord.Client(),
        clientToken = 'NTI4MDA0MTc2MTIzNTI3MTc5.Dwb91g.8Sj1ydMTdihaZ46lGnMXK8iFXw0',
        DieBot = require('./NSCoDDieBot');
let     dieBot = null;

client.login(clientToken);
client.once('ready',()=>{
    dieBot = new DieBot();
    dieBot.hoist(client);
});

process.on(
    'SIGINT',
    ()=>{
        dieBot.shutdown();
        client.destroy();
        process.exit();
    }
);

process.on('unhandledRejection', console.error);