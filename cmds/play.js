'use strict';

const logic = require('../functions/monopoly/mainbrain');


module.exports = {
    name: 'play',

    exec: (client, msg, args) => {
        if (msg.channel.guild.members.get(client.user.id).permission.has('manageMessages')) {
            if (logic.games.filter(g => g.id === msg.channel.id).length > 0) {
                msg.channel.createMessage({
                    embed: {
                        title: 'Error',
                        color: parseInt('ff0000', 16),
                        description: 'You can only have 1 games of Monopoly going in one channel!'
                    }
                })
            } else {
                let game = new logic.Game(client, msg.channel, msg.author);
                logic.games.push(msg.channel);
                game.on('end', () => logic.games = logic.games.filter((g) => g.id !== msg.channel.id));
            }
        } else {
            msg.channel.createMessage({
                embed: {
                    title: 'Error',
                    color: parseInt('ff0000', 16),
                    description: 'I need the permission `MANAGE_MESSAGES` to play monopoly!'
                }
            })
        }
    }
}