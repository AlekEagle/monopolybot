'use strict';

const logic = require('../functions/monopoly/mainbrainbeta');


module.exports = {
    name: 'playbeta',

    exec: (client, msg, args) => {
        if (msg.channel.guild.members.get(client.user.id).permission.has('manageMessages')) {
            if (logic.games.filter(g => g.guild.id === msg.channel.guild.id).length > 0) {
                msg.channel.createMessage({
                    embed: {
                        title: 'Error',
                        color: 0xFF0000,
                        description: 'You can only have 1 games of Monopoly going in one server!'
                    }
                })
            } else {
                let index = logic.games.length;
                logic.games[index] = new logic.Game(client, msg.channel, msg.author);
                logic.games[index].on('end', () => { })
            }
        } else {
            msg.channel.createMessage({
                embed: {
                    title: 'Error',
                    color: 0xFF0000,
                    description: 'I need the permission `MANAGE_MESSAGES` to play monopoly!'
                }
            })
        }
    }
}