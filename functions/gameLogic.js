'use strict';

const communityChest = [{
    name: 'Get Out of Jail Free',
    money: 0,
    special: 'nojail'
}, {
    name: 'Grand Opera Opening',
    money: 50,
    special: 'perplayer'
}, {
    name: 'Go to Jail, Directly to Jail',
    money: 0,
    special: 'tojail'
}, {
    name: 'Income Tax Refund',
    money: 20,
    special: null
}, {
    name: 'Advance to GO',
    money: 0,
    special: 'movetogo'
}, {
    name: 'Life Insurance Matures',
    money: 200,
    special: null
}, {
    name: 'Doctor\'s fee',
    money: -50,
    special: null
}, {
    name: 'Pay Hospital',
    money: -100,
    special: null
}, {
    name: 'You are accessed for street repairs',
    money: 0,
    special: '40house115hotel'
}, {
    name: 'You have won 2nd prize in a beauty contest',
    money: 10,
    special: null
}, {
    name: 'Bank error in your favor',
    money: 200,
    special: null
}, {
    name: 'You inherit $100',
    money: 100,
    special: null
}, {
    name: 'Recieve for services',
    money: 25,
    special: null
}, {
    name: 'Xmas fund matures',
    money: 100,
    special: null
}, {
    name: 'Pay school tax',
    money: -150,
    special: null
}, {
    name: 'Sale of stock',
    money: 45,
    special: null
}];
const chance = [];
const random = require('./randomNumFromRange');
const Map = require('collections/map');
const u_wut_m8 = require('../.auth.json');
const Logger = require('./logger');
const console = new Logger();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`postgres://alekeagle:${u_wut_m8.serverPass}@127.0.0.1:5432/alekeagle`, {
    logging: false
});
class UserStats extends Sequelize.Model {};
UserStats.init({
    xpToLevel: Sequelize.INTEGER,
    level: Sequelize.INTEGER,
    totalXp: Sequelize.INTEGER
}, {
    sequelize
});
class Game {
    constructor(client, message) {
        this.client = client;
        this.map = [{
            name: 'Go',
            pass: 200,
            type: 'special'
        }, {
            name: 'Mediterranean Avenue',
            color: 'darkpurple',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 60,
            rent: {
                "0": 2,
                "1": 10,
                "2": 30,
                "3": 90,
                "4": 160,
                hotel: 250
            },
            mortgage: 30
        }, {
            name: 'Community Chest',
            type: 'special',
            land: 'comchest'
        }, {
            name: 'Baltic Avenue',
            color: 'darkpurple',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 60,
            rent: {
                "0": 4,
                "1": 20,
                "2": 60,
                "3": 180,
                "4": 320,
                hotel: 450
            },
            mortgage: 30
        }, {
            name: 'Income Tax',
            type: 'special',
            land: -200
        }, {
            name: 'Reading Railroad',
            type: 'railroad',
            mortgaged: false,
            ownedBy: null,
            price: 200,
            rent: {
                "1": 25,
                "2": 50,
                "3": 100,
                "4": 200
            },
            mortgage: 100
        }, {
            name: 'Oriental Avenue',
            color: 'lightblue',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 100,
            rent: {
                "0": 6,
                "1": 30,
                "2": 90,
                "3": 270,
                "4": 400,
                hotel: 550
            },
            mortgage: 50
        }, {
            name: 'Chance',
            type: 'special',
            land: 'chance'
        }, {
            name: 'Vermont Avenue',
            color: 'lightblue',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 100,
            rent: {
                "0": 6,
                "1": 30,
                "2": 90,
                "3": 270,
                "4": 400,
                hotel: 550
            },
            mortgage: 50
        }, {
            name: 'Connecticut Avenue',
            color: 'lightblue',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 120,
            rent: {
                "0": 8,
                "1": 40,
                "2": 100,
                "3": 300,
                "4": 450,
                hotel: 600
            },
            mortgage: 60
        }, {
            name: 'Just Visiting Jail',
            type: 'special',
            land: 'visitjail'
        }, {
            name: 'St. Charles Place',
            color: 'lightpurple',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 140,
            rent: {
                "0": 10,
                "1": 50,
                "2": 150,
                "3": 450,
                "4": 625,
                hotel: 750
            },
            mortgage: 70
        }, {
            name: 'Electric Company',
            type: 'utility',
            mortgaged: false,
            ownedBy: null,
            price: 150,
            rent: {
                "1": 4, //todo, add way for dice to be compared here
                "2": 10
            },
            mortgage: 75
        }, {
            name: 'States Avenue',
            color: 'lightpurple',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 140,
            rent: {
                "0": 10,
                "1": 50,
                "2": 150,
                "3": 450,
                "4": 625,
                hotel: 750
            },
            mortgage: 70
        }, {
            name: 'Virginia Avenue',
            color: 'lightpurple',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 160,
            rent: {
                "0": 12,
                "1": 60,
                "2": 180,
                "3": 500,
                "4": 700,
                hotel: 900
            },
            mortgage: 80
        }, {
            name: 'Pennsylvania Railroad',
            type: 'railroad',
            mortgaged: false,
            ownedBy: null,
            price: 200,
            rent: {
                "1": 25,
                "2": 50,
                "3": 100,
                "4": 200
            },
            mortgage: 100
        }, {
            name: 'St. James Place',
            color: 'orange',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 180,
            rent: {
                "0": 14,
                "1": 70,
                "2": 200,
                "3": 550,
                "4": 750,
                hotel: 950
            },
            mortgage: 90
        }, {
            name: 'Community Chest',
            type: 'special',
            land: 'comchest'
        }, {
            name: 'Tennessee Avenue',
            color: 'orange',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 180,
            rent: {
                "0": 14,
                "1": 70,
                "2": 200,
                "3": 550,
                "4": 750,
                hotel: 950
            },
            mortgage: 90
        }, {
            name: 'New York Avenue',
            color: 'orange',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 200,
            rent: {
                "0": 16,
                "1": 80,
                "2": 220,
                "3": 600,
                "4": 800,
                hotel: 1000
            },
            mortgage: 100
        }, {
            name: 'Free Parking',
            type: 'special',
            land: 'none'
        }, {
            name: 'Kentucky Avenue',
            color: 'red',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 220,
            rent: {
                "0": 18,
                "1": 90,
                "2": 250,
                "3": 700,
                "4": 875,
                hotel: 1050
            },
            mortgage: 110
        }, {
            name: 'Indiana Avenue',
            color: 'red',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 220,
            rent: {
                "0": 18,
                "1": 90,
                "2": 250,
                "3": 700,
                "4": 875,
                hotel: 1050
            },
            mortgage: 110
        }, {
            name: 'Illinois Avenue',
            color: 'red',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 240,
            rent: {
                "0": 20,
                "1": 100,
                "2": 300,
                "3": 750,
                "4": 925,
                hotel: 1100
            },
            mortgage: 120
        }, {
            name: 'B & O Railroad',
            type: 'railroad',
            mortgaged: false,
            ownedBy: null,
            price: 200,
            rent: {
                "1": 25,
                "2": 50,
                "3": 100,
                "4": 200
            },
            mortgage: 100
        }, {
            name: 'Atlantic Avenue',
            color: 'yellow',
            type: 'normal',
            mortgaged: false,
            ownedBy: null,
            price: 240,
            rent: {
                "0": 22,
                "1": 110,
                "2": 330,
                "3": 800,
                "4": 975,
                hotel: 1150
            },
            mortgage: 130
        }]
        this.channel = message.channel;
        this.server = message.channel.guild;
        this.players = [];
        this.bankruptPlayers = [];
        this.active = false;
        message.channel.createMessage({
            embed: {
                title: 'Let\'s play Monopoly!',
                color: parseInt('00ff00', 16),
                description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                fields: [{
                    name: 'Players',
                    value: `**1.** ${message.author.username}#${message.author.discriminator}\n**2.** Empty Slot\n**3.** Empty Slot\n**4.** Empty Slot`
                }]
            }
        }).then(msg => {
            this.message = msg;
            this.addPlayer(message.author);
            this.message.addReaction('🚪').then(() => this.message.addReaction('⏹').then(() => this.message.addReaction('▶').then(() => this.message.addReaction('🔚'))))
            this.reactionAddStart = (mes, emoji, user) => {
                let reactor = mes.channel.guild.members.get(user).user;
                if (this.message.id === mes.id && !reactor.bot) {
                    if (emoji.name === '🚪') {
                        this.addPlayer(reactor);
                        this.message.edit({
                            embed: {
                                title: 'Let\'s play Monopoly!',
                                color: parseInt('00ff00', 16),
                                description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                fields: [{
                                    name: 'Players',
                                    value: `**1.** ${this.players[0].username}#${this.players[0].discriminator}\n**2.** ${this.players[1] ? `${this.players[1].username}#${this.players[1].discriminator}` : 'Empty Slot'}\n**3.** ${this.players[2] ? `${this.players[2].username}#${this.players[2].discriminator}` : 'Empty Slot'}\n**4.** ${this.players[3] ? `${this.players[3].username}#${this.players[3].discriminator}` : 'Empty Slot'}`
                                }]
                            }
                        })
                    } else if (emoji.name === '⏹') {
                        if (message.author.id === user) {
                            this.end();
                            this.message.edit({
                                embed: {
                                    title: 'Game canceled',
                                    color: parseInt('ffff00', 16),
                                    description: 'See you again soon!'
                                }
                            }).then(() => {
                                setTimeout(() => {
                                    msg.delete()
                                }, 5000);
                            })
                        }
                    } else if (emoji.name === '▶') {
                        if (message.author.id === user) {
                            if (this.players.length === 1) {
                                this.message.edit({
                                    embed: {
                                        title: 'Monopoly is best played with two people!',
                                        color: parseInt('ffff00', 16),
                                        description: 'Right now, there is no AI for single player mode, if you want to see something like that, please support the creator on patreon https://alekeagle.tk/patreon'
                                    }
                                }).then(() => {
                                    setTimeout(() => {
                                        msg.edit({
                                            embed: {
                                                title: 'Let\'s play Monopoly!',
                                                color: parseInt('00ff00', 16),
                                                description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                                fields: [{
                                                    name: 'Players',
                                                    value: `**1.** ${this.players[0].username}#${this.players[0].discriminator}\n**2.** ${this.players[1] ? `${this.players[1].username}#${this.players[1].discriminator}` : 'Empty Slot'}\n**3.** ${this.players[2] ? `${this.players[2].username}#${this.players[2].discriminator}` : 'Empty Slot'}\n**4.** ${this.players[3] ? `${this.players[3].username}#${this.players[3].discriminator}` : 'Empty Slot'}`
                                                }]
                                            }
                                        })
                                    }, 8000);
                                })
                            } else {
                                this.start();
                            }
                        }
                    } else if (emoji.name === '🔚') {
                        if (this.players.includes(reactor) && message.author.id !== user) {
                            this.removePlayer(reactor);
                            this.message.edit({
                                embed: {
                                    title: 'Let\'s play Monopoly!',
                                    color: parseInt('00ff00', 16),
                                    description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                    fields: [{
                                        name: 'Players',
                                        value: `**1.** ${this.players[0].username}#${this.players[0].discriminator}\n**2.** ${this.players[1] ? `${this.players[1].username}#${this.players[1].discriminator}` : 'Empty Slot'}\n**3.** ${this.players[2] ? `${this.players[2].username}#${this.players[2].discriminator}` : 'Empty Slot'}\n**4.** ${this.players[3] ? `${this.players[3].username}#${this.players[3].discriminator}` : 'Empty Slot'}`
                                    }]
                                }
                            })
                            this.message.removeReaction('🚪', reactor.id)
                            this.message.removeReaction('🔚', reactor.id)
                        } else reactor.getDMChannel().then(chnl => {
                            chnl.createMessage({
                                embed: {
                                    color: parseInt('ff0000', 16),
                                    title: 'Error',
                                    description: 'You can\'t leave a game you own!'
                                }
                            });
                        });
                    }
                }
            }
            this.client.on('messageReactionAdd', this.reactionAddStart)
            this.reactionRemove = (mes, emoji, user) => {
                let reactor = mes.channel.guild.members.get(user).user;
                if (this.message.id === mes.id && !reactor.bot) {
                    switch (emoji.name) {
                        case '🚪':
                            if (!this.active && this.players.includes(reactor) && message.author.id !== user) {
                                this.removePlayer(reactor)
                                this.message.edit({
                                    embed: {
                                        title: 'Let\'s play Monopoly!',
                                        color: parseInt('00ff00', 16),
                                        description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                        fields: [{
                                            name: 'Players',
                                            value: `**1.** ${this.players[0].username}#${this.players[0].discriminator}\n**2.** ${this.players[1] ? `${this.players[1].username}#${this.players[1].discriminator}` : 'Empty Slot'}\n**3.** ${this.players[2] ? `${this.players[2].username}#${this.players[2].discriminator}` : 'Empty Slot'}\n**4.** ${this.players[3] ? `${this.players[3].username}#${this.players[3].discriminator}` : 'Empty Slot'}`
                                        }]
                                    }
                                })
                            } else reactor.getDMChannel().then(chnl => {
                                chnl.createMessage({
                                    embed: {
                                        color: parseInt('ff0000', 16),
                                        title: 'Error',
                                        description: 'You can\'t leave a game you own!'
                                    }
                                });
                            });
                    }
                }
            }
            this.client.on('messageReactionRemove', this.reactionRemove);
        });
    }

    start() {
        this.active = true;
        this.client.off('messageReactionAdd', this.reactionAddStart);
        this.message.removeReactions();
        this.message.addReaction('🔚').then(() => this.message.addReaction('🎲').then(() => this.message.addReaction('📧').then(() => this.message.addReaction('🎲'))))
        this.message.edit({
            embed: {
                title: 'Monopoly',
                color: parseInt('36393E', 16)

            }
        })
        this.reactionAddGame = (mes, emoji, user) => {
            let reactor = mes.channel.guild.members.get(user).user;
            if (this.message.id === mes.id && !reactor.bot) {
                switch (emoji.name) {
                    case '🔚':
                        if (this.players.includes(reactor) && message.author.id !== user) {
                            this.removePlayer(reactor);
                            this.message.removeReaction('🔚', reactor.id);
                        } else reactor.getDMChannel().then(chnl => {
                            chnl.createMessage({
                                embed: {
                                    color: parseInt('ff0000', 16),
                                    title: 'Error',
                                    description: 'You can\'t join a game that you\'re not in or own!'
                                }
                            });
                        });
                        break;
                    case '🎲':

                        break;
                }
            }
        }

    }

    end() {
        this.message = null;
        this.channel = null;
        this.server = null;
        this.players = null;
        this.active = null;
        this.client.off('messageReactionAdd', this.reactionAddStart);
        this.client.off('messageReactionRemove', this.reactionRemove);
        return null;
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p.id !== player.id);
        if (!this.active) {
            player.getDMChannel().then(chnl => {
                chnl.createMessage({
                    embed: {
                        color: parseInt('ffff00', 16),
                        title: 'You left the game!',
                        description: 'You can still rejoin before the game starts.'
                    }
                });
            });
        } else {
            player.getDMChannel().then(chnl => {
                chnl.createMessage({
                    embed: {
                        color: parseInt('ff0000', 16),
                        title: 'You left the game!',
                        description: 'All of your money is forfit and you can\'t rejoin.'
                    }
                });
            });
        }
    }

    addPlayer(player) {
        if (!this.active && !this.players.includes(player)) {
            let newPlayer = {
                ...player,
                money: 1500,
                currentLocation: 0
            }
            this.players.push(newPlayer);
            player.getDMChannel().then(chnl => {
                chnl.createMessage({
                    embed: {
                        color: parseInt('00ff00', 16),
                        title: 'You joined the game!',
                        description: 'to interact with the game, use reactions on the original message, here\'s some below.',
                        fields: [{
                                name: 'Leaving a Game',
                                value: 'You will be able to leave the game at anytime with the 🔚 emoji reaction to the main message in the channel the game was created in.\nLeaving in the middle of a game will automatically cause you to go bankrupt regardless of the money in your account, you will also not be allowed to rejoin. However, if you leave before the game starts you will still be able to join.'
                            },
                            {
                                name: 'Trading',
                                value: 'When it is your turn to move, reacting with the 📧 emoji will allow you to choose someone to trade with whoever you choose in the trading menu.'
                            },
                            {
                                name: 'Making moves',
                                value: 'When it is your turn to move, reacting with the 🎲 emoji will allow you to roll the dice and make a move.'
                            },
                            {
                                name: 'Get ready!',
                                value: 'Thats all, get ready for the game to begin!'
                            }
                        ]
                    }
                });
            }).catch(err => {
                console.error(err);
                this.channel.createMessage(`I couldn't DM <@${player.id}> the instructions, please allow DM's and rejoin the game for instructions.`)
            });
        } else if (this.active) {
            player.getDMChannel().then(chnl => {
                chnl.createMessage({
                    embed: {
                        color: parseInt('ff0000', 16),
                        title: 'Error',
                        description: 'You can\'t join a game that is already started!'
                    }
                });
            });
        } else if (this.players.includes(player)) {
            player.getDMChannel().then(chnl => {
                chnl.createMessage({
                    embed: {
                        color: parseInt('ff0000', 16),
                        title: 'Error',
                        description: 'You can\'t join a game that you\'re already in!'
                    }
                });
            });
        }
    }
}
UserStats.sync({
    force: false
}).then(() => {
    console.log('Successfully synced UserStats!');
});
const multiplier = 1.353;
const beginning = 1500;
module.exports = {
    _UserStats: UserStats,

    giveXP: (userID, earned, client) => {
        return new Promise((resolve, reject) => {
            UserStats.findOne({
                where: {
                    id: userID
                }
            }).then(user => {
                if (user) {
                    let newTotalXp = user.totalXp + earned;
                    if (beginning * (user.level * multiplier) < user.xpToLevel + earned) {
                        let newXpToLevel = (user.xpToLevel + earned) - beginning * (user.level * multiplier);
                        user.update({
                            totalXp: newTotalXp,
                            level: user.level + 1,
                            xpToLevel: newXpToLevel
                        }).then(user => {
                            resolve(user);
                        }).catch(err => {
                            reject(err);
                        });
                    }
                } else {
                    UserStats.create({
                        id: userID,
                        xpToLevel: earned,
                        level: 1,
                        totalXp: earned
                    }).then(user => {
                        resolve(user);
                    }).catch(err => {
                        reject(err);
                    })
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    Game
}