'use strict';

const logic = require('../functions/gameLogic');

module.exports = {
    name: 'play',

    exec: (client, msg, args) => {
        if (logic.games.filter(g => g.guild.id === msg.channel.guild.id).length > 2) {
            msg.channel.createMessage({
                embed: {
                    title: 'Error',
                    color: parseInt('ff0000', 16),
                    description: 'You can only have 3 games of Monopoly going in one server!'
                }
            })
        }else if (logic.games.filter(g => g.id === msg.channel.id)[0]) {
            msg.channel.createMessage({
                embed: {
                    title: 'Error',
                    color: parseInt('ff0000', 16),
                    description: 'You can only have 1 game of Monopoly going in a channel!'
                }
            })
        }
        new logic.Game(client, msg)
    }
}