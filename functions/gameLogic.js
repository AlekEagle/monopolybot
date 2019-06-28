'use strict';

const communityChest = [{
    name: 'Get Out of Jail Free',
    money: 0,
    special: 'nojail'
}, {
    name: 'Grand Opera Opening, Each Player Pays You $50',
    money: -50,
    special: 'perplayer'
}, {
    name: 'Go to Jail, Directly to Jail',
    money: 0,
    special: 'tojail'
}, {
    name: 'Income Tax Refund, Recieve $20',
    money: 20,
    special: null
}, {
    name: 'Advance to GO',
    money: 0,
    special: 'togo'
}, {
    name: 'Life Insurance Matures, Recieve $200',
    money: 200,
    special: null
}, {
    name: 'Doctor\'s fee, Pay $50',
    money: -50,
    special: null
}, {
    name: 'Pay Hospital Bills, Pay $100',
    money: -100,
    special: null
}, {
    name: 'You are accessed for street repairs, Pay $40 for each house and $115 for each hotel',
    money: 0,
    special: '40house115hotel'
}, {
    name: 'You have won 2nd prize in a beauty contest, Recieve $10',
    money: 10,
    special: null
}, {
    name: 'Bank error in your favor, Recieve $200',
    money: 200,
    special: null
}, {
    name: 'You inherit $100',
    money: 100,
    special: null
}, {
    name: 'Recieve for services, Recieve $25',
    money: 25,
    special: null
}, {
    name: 'Xmas fund matures, Recieve $100',
    money: 100,
    special: null
}, {
    name: 'Pay school tax, Pay $150',
    money: -150,
    special: null
}, {
    name: 'Sale of stock, Recieve $45',
    money: 45,
    special: null
}];
const chance = [
    {
    name: 'Go to Jail, Directly to Jail',
    money: 0,
    special: 'tojail'
}, {
    name: 'Get Out of Jail Free',
    money: 0,
    special: 'nojail'
}, {
    name: 'Make general repairs on all your property, Pay $25 for each house and $100 for each hotel',
    money: 0,
    special: '25house100hotel'
}, {
    name: 'Pay poor tax, Pay $15',
    money: -15,
    special: null
}, {
    name: 'You have been elected Chairman of the Board, Pay Each Player $50',
    money: 50,
    special: 'perplayer'
}, {
    name: 'Advance to GO',
    money: 0,
    special: 'togo'
}, {
    name: 'Your building and loan matures, Recieve $150',
    money: 150,
    special: null
}, {
    name: 'Bank pays you, Recieve $50',
    money: 50,
    special: null
}, {
    name: 'Go back 3 spaces',
    money: 0,
    special: 'back3'
}, {
    name: 'Advance to Illinois Avenue',
    money: 0,
    special: 'toillinois'
}, {
    name: 'Take a walk on the board walk',
    money: 0,
    special: 'toboardwalk'
}, {
    name: 'Advance to nearest railroad, and pay owner twice the rental normally owed, otherwise you can buy it',
    money: 0,
    special: 'tonearestrailroadtwiceowed'
}, {
    name: 'Advance to nearest utility and, if unowned you may purchase it, otherwise roll dice again and pay 10 times what you rolled from the dice',
    money: 0,
    special: 'nearestutilityx10'
}, {
    name: 'Take a ride on the Reading Railroad',
    money: 0,
    special: 'toreading'
}, {
    name: 'Advance to St. Charles Place',
    money: 0,
    special: 'tocharles'
}];
const random = require('./randomNumFromRange');
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
        this.map = [
            {
                name: 'Go',
                actions: {
                    land: 200,
                    pass: 200
                },
                type: 'special'
            }, {
                name: 'Mediterranean Avenue',
                color: 'darkpurple',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 60,
                houses: 0,
                rent: {
                    "0": 2,
                    "1": 10,
                    "2": 30,
                    "3": 90,
                    "4": 160,
                    "5": 250
                },
                mortgage: 30
            }, {
                name: 'Community Chest',
                type: 'special',
                actions: {
                    land: 'comchest',
                    pass: null
                },
            }, {
                name: 'Baltic Avenue',
                color: 'darkpurple',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 60,
                houses: 0,
                rent: {
                    "0": 4,
                    "1": 20,
                    "2": 60,
                    "3": 180,
                    "4": 320,
                    "5": 450
                },
                mortgage: 30
            }, {
                name: 'Income Tax',
                type: 'special',
                actions: {
                    pass: null,
                    land: -200
                }
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
                houses: 0,
                rent: {
                    "0": 6,
                    "1": 30,
                    "2": 90,
                    "3": 270,
                    "4": 400,
                    "5": 550
                },
                mortgage: 50
            }, {
                name: 'Chance',
                type: 'special',
                actions: {
                    pass: null,
                    land: 'chance'
                }
            }, {
                name: 'Vermont Avenue',
                color: 'lightblue',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 100,
                houses: 0,
                rent: {
                    "0": 6,
                    "1": 30,
                    "2": 90,
                    "3": 270,
                    "4": 400,
                    "5": 550
                },
                mortgage: 50
            }, {
                name: 'Connecticut Avenue',
                color: 'lightblue',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 120,
                houses: 0,
                rent: {
                    "0": 8,
                    "1": 40,
                    "2": 100,
                    "3": 300,
                    "4": 450,
                    "5": 600
                },
                mortgage: 60
            }, {
                name: 'Just Visiting Jail',
                type: 'special',
                actions: {
                    pass: null,
                    land: null
                }
            }, {
                name: 'St. Charles Place',
                color: 'lightpurple',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 140,
                houses: 0,
                rent: {
                    "0": 10,
                    "1": 50,
                    "2": 150,
                    "3": 450,
                    "4": 625,
                    "5": 750
                },
                mortgage: 70
            }, {
                name: 'Electric Company',
                type: 'utility',
                mortgaged: false,
                ownedBy: null,
                price: 150,
                rent: {
                    "1": 4, 
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
                houses: 0,
                rent: {
                    "0": 10,
                    "1": 50,
                    "2": 150,
                    "3": 450,
                    "4": 625,
                    "5": 750
                },
                mortgage: 70
            }, {
                name: 'Virginia Avenue',
                color: 'lightpurple',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 160,
                houses: 0,
                rent: {
                    "0": 12,
                    "1": 60,
                    "2": 180,
                    "3": 500,
                    "4": 700,
                    "5": 900
                },
                mortgage: 80
            }, {
                name: 'Pennsylvania Railroad',
                type: 'railroad',
                mortgaged: false,
                ownedBy: null,
                price: 200,
                houses: 0,
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
                houses: 0,
                rent: {
                    "0": 14,
                    "1": 70,
                    "2": 200,
                    "3": 550,
                    "4": 750,
                    "5": 950
                },
                mortgage: 90
            }, {
                name: 'Community Chest',
                type: 'special',
                actions: {
                    land: 'comchest',
                    pass: null
                },
            }, {
                name: 'Tennessee Avenue',
                color: 'orange',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 180,
                houses: 0,
                rent: {
                    "0": 14,
                    "1": 70,
                    "2": 200,
                    "3": 550,
                    "4": 750,
                    "5": 950
                },
                mortgage: 90
            }, {
                name: 'New York Avenue',
                color: 'orange',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 200,
                houses: 0,
                rent: {
                    "0": 16,
                    "1": 80,
                    "2": 220,
                    "3": 600,
                    "4": 800,
                    "5": 1000
                },
                mortgage: 100
            }, {
                name: 'Free Parking',
                type: 'special',
                actions: {
                    pass: null,
                    land: null
                }
            }, {
                name: 'Kentucky Avenue',
                color: 'red',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 220,
                houses: 0,
                rent: {
                    "0": 18,
                    "1": 90,
                    "2": 250,
                    "3": 700,
                    "4": 875,
                    "5": 1050
                },
                mortgage: 110
            }, {
                name: 'Indiana Avenue',
                color: 'red',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 220,
                houses: 0,
                rent: {
                    "0": 18,
                    "1": 90,
                    "2": 250,
                    "3": 700,
                    "4": 875,
                    "5": 1050
                },
                mortgage: 110
            }, {
                name: 'Illinois Avenue',
                color: 'red',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 240,
                houses: 0,
                rent: {
                    "0": 20,
                    "1": 100,
                    "2": 300,
                    "3": 750,
                    "4": 925,
                    "5": 1100
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
                price: 260,
                houses: 0,
                rent: {
                    "0": 22,
                    "1": 110,
                    "2": 330,
                    "3": 800,
                    "4": 975,
                    "5": 1150
                },
                mortgage: 130
            }, {
                name: 'Ventnor Avenue',
                color: 'yellow',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 260,
                houses: 0,
                rent: {
                    "0": 22,
                    "1": 110,
                    "2": 330,
                    "3": 800,
                    "4": 975,
                    "5": 1150
                },
                mortgage: 130
            }, {
                name: 'Water Works',
                type: 'utility',
                mortgaged: false,
                ownedBy: null,
                price: 150,
                rent: {
                    "1": 4, 
                    "2": 10
                },
                mortgage: 75
            }, {
                name: 'Marvin Gardens',
                color: 'yellow',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 280,
                houses: 0,
                rent: {
                    "0": 24,
                    "1": 120,
                    "2": 360,
                    "3": 850,
                    "4": 1025,
                    "5": 1200
                },
                mortgage: 140
            }, {
                name: 'Go to jail',
                type: 'special',
                actions: {
                    land: 'tojail',
                    pass: null
                }
            }, {
                name: 'Pacific Avenue',
                color: 'green',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 300,
                houses: 0,
                rent: {
                    "0": 26,
                    "1": 130,
                    "2": 390,
                    "3": 900,
                    "4": 1100,
                    "5": 1275
                },
                mortgage: 150
            }, {
                name: 'North Carolina Avenue',
                color: 'green',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 300,
                houses: 0,
                rent: {
                    "0": 26,
                    "1": 130,
                    "2": 390,
                    "3": 900,
                    "4": 1100,
                    "5": 1275
                },
                mortgage: 150
            }, {
                name: 'Pennsylvania Avenue',
                color: 'green',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 320,
                houses: 0,
                rent: {
                    "0": 28,
                    "1": 150,
                    "2": 450,
                    "3": 1000,
                    "4": 1200,
                    "5": 1400
                },
                mortgage: 160
            }, {
                name: 'Short Line Railroad',
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
                name: 'Chance',
                type: 'special',
                actions: {
                    pass: null,
                    land: 'chance'
                }
            }, {
                name: 'Park Place',
                color: 'blue',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 350,
                houses: 0,
                rent: {
                    "0": 35,
                    "1": 175,
                    "2": 500,
                    "3": 1100,
                    "4": 1300,
                    "5": 1500
                },
                mortgage: 175
            }, {
                name: 'Luxury Tax',
                type: 'special',
                actions: {
                    pass: null,
                    land: -75
                }
            }, {
                name: 'Boardwalk',
                color: 'blue',
                type: 'normal',
                mortgaged: false,
                ownedBy: null,
                price: 400,
                houses: 0,
                rent: {
                    "0": 50,
                    "1": 200,
                    "2": 600,
                    "3": 1400,
                    "4": 1700,
                    "5": 2000
                },
                mortgage: 200
            }
        ]
        this.previousPlayer = -1;
        this.currentPlayer = 0;
        this.nextPlayer = 1;
        this.channel = message.channel;
        this.server = message.channel.guild;
        this.players = [];
        this.bankruptPlayers = [];
        this.active = false;
        this.otherAction = false;
        message.channel.createMessage({
            embed: {
                title: 'Let\'s play Monopoly!',
                color: parseInt('00ff00', 16),
                description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                fields: [{
                    name: 'Players',
                    value: `**1.** <@${message.author.id}>\n**2.** ${this.players[1] ? `<@${this.players[1].id}>` : 'Empty Slot'}\n**3.** ${this.players[2] ? `<@${this.players[2].id}>` : 'Empty Slot'}\n**4.** ${this.players[3] ? `<@${this.players[3].id}>` : 'Empty Slot'}`
                }]
            }
        }).then(msg => {
            this.message = msg;
            this.addPlayer(message.author);
            this.message.addReaction('🚪').then(() => this.message.addReaction('⏹').then(() => this.message.addReaction('▶').then(() => this.message.addReaction('🔚'))))
            this.reactionAddStart = (mes, emoji, user) => {
                let reactor = mes.channel.guild.members.get(user).user;
                if (this.message.id === mes.id && !reactor.bot && !this.otherAction) {
                    if (emoji.name === '🚪') {
                        if (!this.players.filter(p => p.id === reactor.id)[0]) {
                            this.addPlayer(reactor);
                            this.message.edit({
                                embed: {
                                    title: 'Let\'s play Monopoly!',
                                    color: parseInt('00ff00', 16),
                                    description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                    fields: [{
                                        name: 'Players',
                                        value: `**1.** <@${this.players[0].id}>\n**2.** ${this.players[1] ? `<@${this.players[1].id}>` : 'Empty Slot'}\n**3.** ${this.players[2] ? `<@${this.players[2].id}>` : 'Empty Slot'}\n**4.** ${this.players[3] ? `<@${this.players[3].id}>` : 'Empty Slot'}`
                                    }]
                                }
                            });
                        } else {
                            reactor.getDMChannel().then(chnl => {
                                chnl.createMessage({
                                    embed: {
                                        color: parseInt('ff0000', 16),
                                        title: 'Error',
                                        description: 'You can\'t join a game you\'re already in!'
                                    }
                                });
                            });
                        }
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
                                    this.message.delete()
                                }, 5000);
                            });
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
                                        this.message.edit({
                                            embed: {
                                                title: 'Let\'s play Monopoly!',
                                                color: parseInt('00ff00', 16),
                                                description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                                fields: [{
                                                    name: 'Players',
                                                    value: `**1.** <@${this.players[0].id}>\n**2.** ${this.players[1] ? `<@${this.players[1].id}>` : 'Empty Slot'}\n**3.** ${this.players[2] ? `<@${this.players[2].id}>` : 'Empty Slot'}\n**4.** ${this.players[3] ? `<@${this.players[3].id}>` : 'Empty Slot'}`
                                                }]
                                            }
                                        });
                                    }, 8000);
                                });
                            } else {
                                this.start();
                            }
                        }
                    } else if (emoji.name === '🔚') {
                        if (this.players.filter(p => p.id === reactor.id)[0] && message.author.id !== user) {
                            this.removePlayer(reactor);
                            this.message.edit({
                                embed: {
                                    title: 'Let\'s play Monopoly!',
                                    color: parseInt('00ff00', 16),
                                    description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                    fields: [{
                                        name: 'Players',
                                        value: `**1.** <@${this.players[0].id}>\n**2.** ${this.players[1] ? `<@${this.players[1].id}>` : 'Empty Slot'}\n**3.** ${this.players[2] ? `<@${this.players[2].id}>` : 'Empty Slot'}\n**4.** ${this.players[3] ? `<@${this.players[3].id}>` : 'Empty Slot'}`
                                    }]
                                }
                            });
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
                    this.message.removeReaction(emoji.name, reactor.id)
                }
            }
            this.client.on('messageReactionAdd', this.reactionAddStart)
        });
    }

    start() {
        this.active = true;
        this.client.off('messageReactionAdd', this.reactionAddStart);
        this.message.removeReactions().then(() => this.message.addReaction('🔚').then(() => this.message.addReaction('🎲').then(() => this.message.addReaction('📧').then(() => this.message.addReaction('bankrupt:593118614031171586').then(() => this.message.addReaction('💳').then(() => this.message.addReaction('ℹ')))))));
        this.message.edit({
            content: `<@${this.players[this.currentPlayer].id}>`,
            embed: {
                title: 'Monopoly',
                color: parseInt('36393E', 16),
                description: 'And we begin! Everyone starts at GO with $1500',
                fields: [{
                    name: 'Players',
                    value: `Up now: <@${this.players[this.currentPlayer].id}>\nUp next: <@${this.players[this.nextPlayer].id}>`
                },
                {
                    name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                    value: this.players[this.currentPlayer].money
                }]

            }
        });
        this.reactionAddGame = (mes, emoji, user) => {
            let reactor = mes.channel.guild.members.get(user).user;
            if (this.message.id === mes.id && !reactor.bot) {
                switch (emoji.name) {
                    case '🔚':
                        if (this.players.filter(p => p.id === reactor.id)[0]) {
                            this.removePlayer(reactor);
                            this.message.removeReaction('🔚', reactor.id);
                        } else reactor.getDMChannel().then(chnl => {
                            chnl.createMessage({
                                embed: {
                                    color: parseInt('ff0000', 16),
                                    title: 'Error',
                                    description: 'You can\'t leave a game that you\'re not in!'
                                }
                            });
                        });
                        break;
                    case '🎲':
                        if (this.players[this.currentPlayer].id === reactor.id && !this.otherAction) {
                            if (!this.players[this.currentPlayer].bankruptcyMode) {
                                this.movePlayer();
                            }else {
                                let messageDescription = this.channel.messages.get(this.message.id).embeds[0].description;
                                this.message.edit({
                                    embed: {
                                        title: 'Monopoly',
                                        color: parseInt('ffff00', 16),
                                        description: 'You can\'t move when you are in possible bankruptcy'
                                    }
                                }).then(() => {
                                    setTimeout(() => {
                                        this.message.edit({
                                            embed: {
                                                title: 'Monopoly',
                                                color: parseInt('36393E', 16),
                                                description: messageDescription,
                                                fields: [{
                                                    name: 'Players',
                                                    value: `Up now: <@${this.players[this.currentPlayer].id}>\nUp next: <@${this.players[this.nextPlayer].id}>`
                                                },
                                                {
                                                    name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                                                    value: this.players[this.currentPlayer].money
                                                }]
                                            }
                                        });
                                    }, 8000);
                                });
                            }
                        }
                        break;
                    case '📧':
                        if (this.players[this.currentPlayer].id === reactor.id && !this.otherAction) {
                            this.handleTrading()
                        }
                        break;
                    case 'bankrupt':
                        if (this.players[this.currentPlayer].id === reactor.id && !this.otherAction) {
                            if (!this.players[this.currentPlayer].bankruptcyMode) {
                                let messageDescription = this.channel.messages.get(this.message.id).embeds[0].description;
                                this.message.edit({
                                    embed: {
                                        title: 'Monopoly',
                                        color: parseInt('ffff00', 16),
                                        description: 'You can\'t file for bankruptcy if you don\'t need to!'
                                    }
                                }).then(() => {
                                    setTimeout(() => {
                                        this.message.edit({
                                            embed: {
                                                title: 'Monopoly',
                                                color: parseInt('36393E', 16),
                                                description: messageDescription,
                                                fields: [{
                                                    name: 'Players',
                                                    value: `Up now: <@${this.players[this.currentPlayer].id}>\nUp next: <@${this.players[this.nextPlayer].id}>`
                                                },
                                                {
                                                    name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                                                    value: this.players[this.currentPlayer].money
                                                }]
                                            }
                                        });
                                    }, 8000);
                                });
                            }
                        }
                    break;
                    case 'ℹ':
                        if (this.players.filter(p => p.id === reactor.id)[0]) {
                            let thisPlayer = this.players.filter(p => p.id === reactor.id)[0]
                            reactor.getDMChannel().then(chnl => {
                                chnl.createMessage({
                                    embed: {
                                        color: parseInt('00ff00', 16),
                                        title: 'Monopoly Player Stats',
                                        fields: [
                                            {
                                                name: 'Money',
                                                value: thisPlayer.money,
                                                inline: true
                                            },
                                            {
                                                name: 'Properties Owned',
                                                value: this.map.filter(m => m.ownedBy === thisPlayer.id).length.toString(),
                                                inline: true
                                            },
                                            {
                                                name: 'Properties Mortgaged',
                                                value: this.map.filter(m => m.ownedBy === thisPlayer.id && m.mortgaged).length.toString(),
                                                inline: true
                                            },
                                            {
                                                name: 'List of Properties Owned',
                                                value: this.map.filter(m => m.ownedBy === thisPlayer.id).map(m => m.name).join('\n') === '' ? 'None' : this.map.filter(m => m.ownedBy === thisPlayer.id).map(m => m.name).join('\n')
                                            },
                                            {
                                                name: 'List of Properties Mortgaged',
                                                value: this.map.filter(m => m.ownedBy === thisPlayer.id && m.mortgaged).map(m => m.name).join('\n') === '' ? 'None' : this.map.filter(m => m.ownedBy === thisPlayer.id && m.mortgaged).map(m => m.name).join('\n')
                                            }
                                        ]
                                    }
                                });
                            });
                        }else {
                            reactor.getDMChannel().then(chnl => {
                                chnl.createMessage({
                                    embed: {
                                        color: parseInt('ff0000', 16),
                                        title: 'Error',
                                        description: 'You can\'t get player stats for yourself if you aren\'t in the game!'
                                    }
                                });
                            });
                        }
                    break;
                }
                this.message.removeReaction(emoji.name === 'bankrupt' ? `${emoji.name}:${emoji.id}` : emoji.name, reactor.id);
            }
        }
        this.client.on('messageReactionAdd', this.reactionAddGame);
    }

    returnToReadyState(readyStateMessage) {
        this.otherAction = false;
        this.message.addReaction('🔚').then(() => this.message.addReaction('🎲').then(() => this.message.addReaction('📧').then(() => this.message.addReaction('bankrupt:593118614031171586').then(() => this.message.addReaction('💳').then(() => this.message.addReaction('ℹ'))))));
        this.message.edit({
            content: `<@${this.players[this.currentPlayer].id}>`,
            embed: {
                title: 'Monopoly',
                color: parseInt('36393E', 16),
                description: readyStateMessage.replace(/{{previoususer}}/g, `<@${this.players[this.previousPlayer].id}>`).replace(/{{currentuser}}/g, `<@${this.players[this.currentPlayer].id}>`).replace(/{{nextuser}}/g, `<@${this.players[this.nextPlayer].id}>`),
                fields: [{
                    name: 'Players',
                    value: `Up now: <@${this.players[this.currentPlayer].id}>\nUp next: <@${this.players[this.nextPlayer].id}>`
                },
                {
                    name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                    value: this.players[this.currentPlayer].money
                }]
            }
        });
    }

    end() {
        if (!this.active) {
            this.client.off('messageReactionAdd', this.reactionAddStart);
        } else this.client.off('messageReactionAdd', this.reactionAddGame);
        this.channel = null;
        this.server = null;
        this.players = null;
        this.active = null;
        return null;
    }

    movePlayer(moveTo) {
        let die1, die2;
        if (moveTo) {
            die1 = moveTo / 2;
            die2 = moveTo / 2;
        }else {
            this.message.edit({
                content: `<@${this.players[this.currentPlayer].id}>`,
                embed: {
                    title: 'Monopoly',
                    color: parseInt('36393E', 16),
                    description: 'Rolling the dice..',
                    fields: [{
                        name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                        value: this.players[this.currentPlayer].money
                    }]
                }
            }).then(() => {
                die1 = random(1, 6);
                die2 = random(1, 6);
                setTimeout(() => {
                    this.message.edit({
                        content: `<@${this.players[this.currentPlayer].id}>`,
                        embed: {
                            title: 'Monopoly',
                            color: parseInt('36393E', 16),
                            description: 'Moving..',
                            fields: [{
                                name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                                value: this.players[this.currentPlayer].money
                            },
                            {
                                name: 'Die 1',
                                value: die1
                            },
                            {
                                name: 'Die 2',
                                value: die2
                            }]
                        }
                    }).then(() => {
                        setTimeout(() => {
                            if (this.players[this.currentPlayer].currentLocation !== 'jail' && !this.players[this.currentPlayer].bankruptcyMode) {
                                this.players[this.currentPlayer].currentLocation ++
                                for (let i = 0; i <= (die1 + die2); i ++) {
                                    if (i < (die1 + die2)) {
                                        if (this.map[this.players[this.currentPlayer].currentLocation].type === 'special') this.handleSpecialMapLocation(this.map[this.players[this.currentPlayer].currentLocation], 'pass', die1, die2);
                                    }else {
                                        this.players[this.currentPlayer].currentLocation --
                                        if (this.map[this.players[this.currentPlayer].currentLocation].type === 'special') this.handleSpecialMapLocation(this.map[this.players[this.currentPlayer].currentLocation], 'land', die1, die2);
                                        else this.handleMapLocation(this.map[this.players[this.currentPlayer].currentLocation], die1, die2);
                                    }
                                    if (i < (die1 + die2)) {
                                        if (++ this.players[this.currentPlayer].currentLocation === this.map.length) this.players[this.currentPlayer].currentLocation = 0;
                                    }
                                }
                            }
                        }, 2000);
                    });
                }, 2000);
            });
        }
    }

    handleSpecialMapLocation(location, type, die1, die2) {
        if (type === 'pass') {
            if (typeof location.actions.pass === 'number') {
                this.players[this.currentPlayer].money += location.actions.pass
            };
        }else if (type === 'land') {
            if (typeof location.actions.land === 'number') {
                this.players[this.currentPlayer].money += location.actions.land;
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land}!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land}!\nIt is now {{currentuser}}\'s turn!`);
                }
            }else if (typeof location.actions.land === 'string') {
                switch(location.actions.land) {
                    case 'comchest':
                        let comchest = communityChest[Math.round(Math.random() * communityChest.length)]
                        this.handleCards(comchest, 'Community Chest', die1, die2);
                    break;
                    case 'chance':
                        let chancecrd = chance[Math.round(Math.random() * chance.length)]
                        this.handleCards(chancecrd, 'Chance Pile', die1, die2);
                    break;
                    case 'tojail':
                        this.players[this.currentPlayer].currentLocation = 'jail';
                        this.advancePlayer();
                        this.returnToReadyState(`{{previoususer}} landed on the "Go to jail space"! They are now in jail!\nIt is now {{currentuser}}\'s turn!`);
                    default:
                        if(die1 === die2) {
                            this.returnToReadyState(`{{currentuser}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land}!\nThey also rolled a double, so they go again!`);
                        }else {
                            this.advancePlayer();
                            this.returnToReadyState(`{{previoususer}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land}!\nIt is now {{currentuser}}\'s turn!`);
                        }
                }
                return;
            }else {
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land}!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land}!\nIt is now {{currentuser}}\'s turn!`);
                }
            }
        }
    }

    handleMapLocation(location, die1, die2) {
        if (location.ownedBy && location.ownedBy === this.players[this.currentPlayer].id) {
            if(die1 === die2) {
                this.returnToReadyState(`{{currentuser}} landed on their own property ${location.name}!\nThey also rolled a double, so they go again!`);
            }else {
                this.advancePlayer();
                this.returnToReadyState(`{{previoususer}} landed on their own property ${location.name}!\nIt is now {{currentuser}}\'s turn!`);
            }
        }else if (location.ownedBy && location.ownedBy !== this.players[this.currentPlayer].id) {
            this.handleRent(location, die1, die2);
        }else if (!location.ownedBy) {
            this.handlePurchase(location, die1, die2);
        }
    }

    handlePurchase(property, die1, die2) {
        this.otherAction = true;
        this.message.edit({
            embed: {
                title: 'Monopoly',
                color: parseInt('36393E', 16),
                description: `You landed on ${property.name}, which is not owned. Would you like to purchase it for $${property.price}? Not purchasing it will begin an auction for it.`,
                fields: [{
                    name: `${this.players[this.currentPlayer].username}#${this.players[this.currentPlayer].discriminator}'s Money`,
                    value: this.players[this.currentPlayer].money
                },
                {
                    name: 'Die 1',
                    value: die1
                },
                {
                    name: 'Die 2',
                    value: die2
                }]
            }
        })
        this.message.addReaction('✅').then(() => this.message.addReaction('❎'));
        this.reactionAddPurchase = (mes, emoji, user) => {
            let reactor = mes.channel.guild.members.get(user).user;
            if (mes.id === this.message.id && !reactor.bot && reactor.id === this.players[this.currentPlayer].id) {
                switch(emoji.name) {
                    case '✅':
                        this.map[this.map.indexOf(property)].ownedBy = this.players[this.currentPlayer].id;
                        this.players[this.currentPlayer].money -= property.price;
                        if(die1 === die2) {
                            this.client.off('messageReactionAdd', this.reactionAddPurchase);
                            this.message.removeReaction('✅').then(() => this.message.removeReaction('❎'));
                            this.returnToReadyState(`{{currentuser}} landed on ${property.name} and bought it for $${property.price}!\nThey also rolled a double, so they go again!`);
                        }else {
                            this.advancePlayer();
                            this.client.off('messageReactionAdd', this.reactionAddPurchase);
                            this.message.removeReaction('✅').then(() => this.message.removeReaction('❎'));
                            this.returnToReadyState(`{{previoususer}} landed on ${property.name} and bought it for $${property.price}!\nIt is now {{currentuser}}\'s turn!`);
                        }
                    break;
                    case '❎':
                        this.client.off('messageReactionAdd', this.reactionAddPurchase);
                        this.message.removeReaction('✅').then(() => this.message.removeReaction('❎'));
                        let array = [property];
                        this.handleAuction(array, 'user', die1, die2);
                    break;
                }
                this.message.removeReaction(emoji.name === 'bankrupt' ? `${emoji.name}:${emoji.id}` : emoji.name, reactor.id);
            }
        }
        this.client.on('messageReactionAdd', this.reactionAddPurchase);
    }

    handleTrading() {
        
    }

    handleBankruptcy() {

    }

    handleBuyingHousing() {

    }

    handleMortgaging() {

    }

    handleAuction(properties, auctionType, die1, die2) {
        this.message.addReaction('🆙');
        for (let i = 0; i <= properties.length; i ++) {
            let p = properties[0]
            if (i < properties.length) {
                let highestBidder, currentPrice, timeout1, timeout2, timeout3;
                currentPrice = p.price - 100;
                this.message.edit({
                    embed: {
                        color: parseInt('36393E', 16),
                        title: 'Monopoly',
                        description: 'We got a couple of properties that are up for auction. To increase your bidding amount, hit the 🆙 reaction.',
                        fields: [
                            {
                                name: 'Property up now',
                                value: p.name,
                                inline: true
                            },
                            {
                                name: 'Current price',
                                value: currentPrice + 100,
                                inline: true
                            },
                            {
                                name: 'Current Highest Bidder',
                                value: highestBidder ? `<@${highestBidder}>` : 'None',
                                inline: true
                            }
                        ]
                    }
                })
                this.reactionAddAuction = (mes, emoji, user) => {
                    let reactor = mes.channel.guild.members.get(user).user;
                    if (this.players.filter(l => l.id === reactor.id && (auctionType === 'user' ? l.id !== this.players[this.currentPlayer].id : true))[0]) {
                        switch(emoji.name) {
                            case '🆙':
                                clearTimeout(timeout1);
                                clearTimeout(timeout2);
                                clearTimeout(timeout3);
                                timeout1 = null;
                                timeout2 = null;
                                timeout3 = null;
                                highestBidder = reactor.id
                                currentPrice += 100
                                this.message.edit({
                                    embed: {
                                        color: parseInt('36393E', 16),
                                        title: 'Monopoly',
                                        description: `**__<@${reactor.id}>__** just ${currentPrice === p.price ? 'started the bidding off!' : 'raised the bid price another $100!'}`,
                                        fields: [
                                            {
                                                name: 'Property up now',
                                                value: p.name,
                                                inline: true
                                            },
                                            {
                                                name: 'Current price',
                                                value: currentPrice,
                                                inline: true
                                            },
                                            {
                                                name: 'Current Highest Bidder',
                                                value: highestBidder ? `<@${highestBidder}>` : 'None',
                                                inline: true
                                            }
                                        ]
                                    }
                                }).then(() => {
                                    timeout1 = setTimeout(() => {
                                        this.message.edit({
                                            embed: {
                                                color: parseInt('36393E', 16),
                                                title: 'Monopoly',
                                                description: 'Going once..',
                                                fields: [
                                                    {
                                                        name: 'Property up now',
                                                        value: p.name,
                                                        inline: true
                                                    },
                                                    {
                                                        name: 'Current price',
                                                        value: currentPrice,
                                                        inline: true
                                                    },
                                                    {
                                                        name: 'Current Highest Bidder',
                                                        value: highestBidder ? `<@${highestBidder}>` : 'None',
                                                        inline: true
                                                    }
                                                ]
                                            }
                                        }).then(() => {
                                            timeout2 = setTimeout(() => {
                                                this.message.edit({
                                                    embed: {
                                                        color: parseInt('36393E', 16),
                                                        title: 'Monopoly',
                                                        description: 'Going twice..',
                                                        fields: [
                                                            {
                                                                name: 'Property up now',
                                                                value: p.name,
                                                                inline: true
                                                            },
                                                            {
                                                                name: 'Current price',
                                                                value: currentPrice,
                                                                inline: true
                                                            },
                                                            {
                                                                name: 'Current Highest Bidder',
                                                                value: highestBidder ? `<@${highestBidder}>` : 'None',
                                                                inline: true
                                                            }
                                                        ]
                                                    }
                                                }).then(() => {
                                                    timeout3 = setTimeout(() => {
                                                        this.message.edit({
                                                            embed: {
                                                                color: parseInt('36393E', 16),
                                                                title: 'Monopoly',
                                                                description: `Sold! To <@${highestBidder}>!`,
                                                                fields: [
                                                                    {
                                                                        name: 'Property up now',
                                                                        value: p.name,
                                                                        inline: true
                                                                    },
                                                                    {
                                                                        name: 'Current price',
                                                                        value: currentPrice,
                                                                        inline: true
                                                                    },
                                                                    {
                                                                        name: 'Current Highest Bidder',
                                                                        value: highestBidder ? `<@${highestBidder}>` : 'None',
                                                                        inline: true
                                                                    }
                                                                ]
                                                            }
                                                        });
                                                        this.map[this.map.indexOf(p)].ownedBy = highestBidder;
                                                        this.client.off('messageReactionAdd', this.reactionAddAuction);
                                                        if (auctionType === 'user') {
                                                            this.players[this.currentPlayer].money += currentPrice;
                                                            this.players.filter(e => e.id === reactor.id)[0].money -= currentPrice;
                                                        }else {
                                                            this.players.filter(e => e.id === reactor.id)[0].money -= currentPrice;
                                                        }
                                                        if (i === (properties.length - 1)) {
                                                            if(auctionType === 'user') {
                                                                if(die1 === die2) {
                                                                    this.returnToReadyState(`{{currentuser}} started an auction and sold some properties!\nThey also rolled a double, so they go again!`);
                                                                }else {
                                                                    this.advancePlayer();
                                                                    this.returnToReadyState(`{{previoususer}} started an auction and sold some properties!\nIt is now {{currentuser}}\'s turn!`);
                                                                }
                                                            }
                                                            this.message.removeReaction('🆙');
                                                        }
                                                    }, 2000);
                                                });
                                            }, 2000);
                                        });
                                    }, 2000);
                                });
                        }
                    }
                }
                this.client.on('messageReactionAdd', this.reactionAddAuction);
            }
        }
    }

    handleCards(card, deck, die1, die2) {
        switch(card.special) {
            case 'perplayer':
                this.players.forEach(p => {
                    if (p.id === this.players[this.currentPlayer].id) return;
                    else {
                        p.money += card.money;
                        this.players[this.currentPlayer].money -= card.money;
                    }
                });
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'nojail': 
                this.players[this.currentPlayer].noJailCards++;
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'tojail':
                this.players[this.currentPlayer].currentLocation = 'jail';
                this.advancePlayer();
                this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card! They are now in jail!\nIt is now {{currentuser}}\'s turn!`);
            break;
            case 'togo':
                this.players[this.currentPlayer].currentLocation = 0;
                this.players[this.currentPlayer].money += 200;
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case '40house115hotel': 
                let houses = this.map.filter(p => p.ownedBy === this.players[this.currentPlayer].id && p.houses && p.houses < 5).map(p => p.houses).reduce((a, b) => a + b, 0);
                let hotels = this.map.filter(p => p.ownedBy === this.players[this.currentPlayer].id && p.houses && p.houses === 5).map(p => p.houses).reduce((a, b) => a + b, 0);
                this.players[this.currentPlayer].money -= ((houses * 40) + (hotels * 115));
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case '25house100hotel':
                this.players[this.currentPlayer].money -= ((this.map.filter(p => p.ownedBy === this.players[this.currentPlayer].id && p.houses && p.houses < 5).map(p => p.houses).reduce((a, b) => a + b, 0) * 25) + (this.map.filter(p => p.ownedBy === this.players[this.currentPlayer].id && p.houses && p.houses === 5).map(p => p.houses).reduce((a, b) => a + b, 0) * 100));
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'back3':
                this.players[this.currentPlayer].currentLocation -= 3;
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'toillinois':
                if (this.map.indexOf(this.map.filter(p => p.name === 'Illinois Avenue')[0]) < this.players[this.currentPlayer].currentLocation) this.movePlayer(this.map.length - this.players[this.currentPlayer].currentLocation + this.map.indexOf(this.map.filter(p => p.name === 'Illinois Avenue')[0]));
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'toboardwalk':
                movePlayer(this.map.indexOf(this.map.filter(p => p.name === 'Boardwalk')[0]) - this.players[this.currentPlayer].currentLocation);
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'tonearestrailroadtwiceowed':
                this.players[this.currentPlayer].currentLocation = this.map.indexOf(this.map.filter((p, i) => p.type === 'railroad' && i >= this.players[this.currentPlayer].currentLocation)[0])
                this.handleRent(this.map[this.players[this.currentPlayer].currentLocation]);
                this.handleRent(this.map[this.players[this.currentPlayer].currentLocation]);
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'nearestutilityx10':
                this.players[this.currentPlayer].currentLocation = this.map.indexOf(this.map.filter((p, i) => p.type === 'utility' && i >= this.players[this.currentPlayer].currentLocation)[0])
                if (this.players[this.currentPlayer].money < die1 * 10) {
                    this.handleBankruptcy();
                }else {
                    this.players.filter(p => p.id === this.map[this.players[this.currentPlayer].currentLocation].ownedBy)[0].money += die * 10;
                    this.players[this.currentPlayer].money -= die1 * 10;
                    if(die1 === die2) {
                        this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                    }else {
                        this.advancePlayer();
                        this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                    }
                }
                
            break;
            case 'toreading':
                if (this.map.indexOf(this.map.filter(p => p.name === 'Reading Railroad')[0]) < this.players[this.currentPlayer].currentLocation) this.movePlayer(this.map.length - this.players[this.currentPlayer].currentLocation + this.map.indexOf(this.map.filter(p => p.name === 'Reading Railroad')[0]));
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case 'tocharles':
                if (this.map.indexOf(this.map.filter(p => p.name === 'St. Charles Place')[0]) < this.players[this.currentPlayer].currentLocation) this.movePlayer(this.map.length - this.players[this.currentPlayer].currentLocation + this.map.indexOf(this.map.filter(p => p.name === 'St. Charles Place')[0]));
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
            case null:
                this.players[this.currentPlayer].money += card.money;
                if(die1 === die2) {
                    this.returnToReadyState(`{{currentuser}} pulled from the ${deck} and recieved a "${card.name}" card!\nThey also rolled a double, so they go again!`);
                }else {
                    this.advancePlayer();
                    this.returnToReadyState(`{{previoususer}} pulled from the ${deck} and recieved a "${card.name}" card!\nIt is now {{currentuser}}\'s turn!`);
                }
            break;
        }
        return;
    }

    handleRent(property, die1, die2) {
        switch(property.type) {
            case 'normal': 
                if (this.players[this.currentPlayer].money < property.rent[property.houses.toString()]) {
                    this.handleBankruptcy(property);
                }else {
                    this.players.filter(p => p.id === property.ownedBy)[0].money += property.rent[property.houses.toString()];
                    this.players[this.currentPlayer].money -= property.rent[property.houses.toString()];
                    if(die1 === die2 && die1 && die2) {
                        this.returnToReadyState(`{{currentuser}} went to ${property.name} had to pay $${property.rent[property.houses.toString()]} to <@${property.ownedBy}> in rent!\nThey also rolled a double, so they go again!`);
                    }else {
                        this.advancePlayer();
                        this.returnToReadyState(`{{previoususer}} went to ${property.name} had to pay $${property.rent[property.houses.toString()]} to <@${property.ownedBy}> in rent!\nIt is now {{currentuser}}\'s turn!`);
                    }
                }
            break;
            case 'railroad':
                if (this.players[this.currentPlayer].money < property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()]) {
                    this.handleBankruptcy();
                }else {
                    this.players.filter(p => p.id === property.ownedBy)[0].money += property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()];
                    this.players[this.currentPlayer].money -= property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()];
                    if(die1 === die2 && die1 && die2) {
                        this.returnToReadyState(`{{currentuser}} went to ${property.name} had to pay $${property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()]} to <@${property.ownedBy}> in rent!\nThey also rolled a double, so they go again!`);
                    }else {
                        this.advancePlayer();
                        this.returnToReadyState(`{{previoususer}} went to ${property.name} had to pay $${property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()]} to <@${property.ownedBy}> in rent!\nIt is now {{currentuser}}\'s turn!`);
                    }
                }
            break;
            case 'utility':
                this.otherAction = true;
                this.message.edit({
                    content: `<@${this.players[this.currentPlayer].id}>`,
                    embed: {
                        title: 'Monopoly',
                        color: parseInt('36393E', 16),
                        description: `You landed on ${property.name}, which owned by <@${property.ownedBy}> and not mortgaged, to continue, roll the die.`,
                        fields: [{
                            name: 'Your money',
                            value: `Up now: <@${this.players[this.currentPlayer].id}>\nUp next: <@${this.players[this.nextPlayer].id}>`
                        },
                        {
                            name: 'Die 1',
                            value: die1
                        },
                        {
                            name: 'Die 2',
                            value: die2
                        }]
                    }
                })
                this.reactionAddUtility = (mes, emoji, user) => {
                    let reactor = mes.channel.guild.members.get(user).user;
                    if (this.message.id === mes.id && !reactor.bot && emoji.name === '🎲') {
                        let die = random(1, 6);
                        if (this.players[this.currentPlayer].money < die * property.rent[this.map.filter(p => p.type === 'utility' && p.ownedBy === property.ownedBy).length.toString()]) {
                            this.handleBankruptcy();
                        }else {
                            this.players.filter(p => p.id === property.ownedBy)[0].money += die * property.rent[this.map.filter(p => p.type === 'utility' && p.ownedBy === property.ownedBy).length.toString()];
                            this.players[this.currentPlayer].money -= die * property.rent[this.map.filter(p => p.type === 'utility' && p.ownedBy === property.ownedBy).length.toString()];
                            if(die1 === die2 && die1 && die2) {
                                this.returnToReadyState(`{{currentuser}} went to ${property.name} had to pay $${property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()]} to <@${property.ownedBy}> in rent!\nThey also rolled a double, so they go again!`);
                            }else {
                                this.advancePlayer();
                                this.returnToReadyState(`{{previoususer}} went to ${property.name} had to pay $${property.rent[this.map.filter(p => p.type === 'railroad' && p.ownedBy === property.ownedBy).length.toString()]} to <@${property.ownedBy}> in rent!\nIt is now {{currentuser}}\'s turn!`);
                            }
                        }
                    }
                }
                this.client.on('messageReactionAdd', this.reactionAddUtility);
        }
        return;
    }

    advancePlayer() {
        this.previousPlayer = this.currentPlayer;
        this.currentPlayer = this.nextPlayer;
        if (this.players[this.nextPlayer + 1]) this.nextPlayer ++;
        else this.nextPlayer = 0;
        return;
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
        if (this.players.length < 2) {
            this.end();
            this.message.edit({
                embed: {
                    title: 'Game Ended',
                    color: parseInt('ffff00', 16),
                    description: 'The game ended because there wasn\'t enough players to play!'
                }
            }).then(() => {
                setTimeout(() => {
                    this.message.delete()
                }, 5000);
            });
        }else if (!this.players[this.currentPlayer]) {
            this.advancePlayer();
            this.returnToReadyState('A player left!\nIt is now {{currentuser}}\'s turn!');
        }
        return;
    }

    addPlayer(player) {
        if (!this.active) {
            let newPlayer = {
                ...player,
                money: 1500,
                currentLocation: 0,
                noJailCards: 0,
                bankruptcyMode: false,
                hasMortgages: false,
                doublesInRow: 0
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
                                name: 'Mortgaging Properties',
                                value: 'When it is your turn to move, if you land on a location that you must pay rent for, but don\'t have enough money to pay for the rent specified, you will be able to mortgage properties, in order to pay for the rent, however, in order to begin mortgaging properties, you must sell all houses and hotels on the color group of the property you wish to mortgage (utilities and railroads do not have color groups, they are standalone, they also do not have houses or hotels). Once mortgaged, you cannot collect rent, you will be able to pay the mortgage off at anytime with the 💳 emoji, but you will be required to pay it upon landing on it.'
                            },
                            {
                                name: 'Filing for Bankruptcy',
                                value: 'When it is your turn to move, if you land on a location that you must pay rent for, but don\'t have enough money to pay for the rent specified, you are able to go and sell your houses and hotels on locations you own, however, if you do not have enough money you may file for bankruptcy with the <:bankrupt:593118614031171586> emoji. Upon filing for bankruptcy, if you owe the bank, you give up all items of value to the bank and retire from the game, the bank will then hold an auction auctioning all of your properties away. If you owe another player, you have of value to the other player, and retire from the game.'
                            },
                            {
                                name: 'Check your In-Game Stats',
                                value: 'At anytime, you are allowed to react to the message with ℹ to Get a DM with your stats in-game.'
                            },
                            {
                                name: 'Get ready!',
                                value: 'Thats all, get ready for the game to begin! If you need more information, please take some time to read: [Monopoly Official Rules | Wikibooks.org](https://en.wikibooks.org/wiki/Monopoly/Official_Rules)'
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
        return;
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
                    });
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

    Game
}