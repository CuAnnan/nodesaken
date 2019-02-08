'use strict';
const   Discord = require('discord.js'),
        client = new Discord.Client(),
        clientToken = 'NTI4MDA0MTc2MTIzNTI3MTc5.Dwb91g.8Sj1ydMTdihaZ46lGnMXK8iFXw0',
        CoDie = require('./CoDDieBot.js');

client.login(clientToken);
client.once('ready',()=>{CoDie.hoist(client);});

process.on(
    'SIGINT',
    ()=>{
        CoDie.shutdown();
        client.destroy();
        process.exit();
    }
);

process.on('unhandledRejection', console.error);