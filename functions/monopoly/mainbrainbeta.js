'use strict';

const random = require('../randomNumFromRange');
const map = require('./map.json');
const Logger = require('../logger');
const console = new Logger();
let games = [];
const EventEmitter = require('events');
const {
    communityChest,
    chance
} = require('./cards.json');

class GameBeta extends EventEmitter {
    constructor(client, channel, owner) {
        super();
        //initialize all variables
        this.map = map;
        this.client = client;
        this.channel = channel;
        this.gameOwner = owner.id;
        this.players = [];
        this.bankruptPlayers = [];
        this.active = false;
        this.moving = false;
        this.otherAction = false;
        games.push(this.channel);
        //add the person who started the game to the players list
        this.addPlayer(owner).then(() => {
            //create beginning message
            channel.createMessage({
                embed: {
                    title: 'Let\'s play Monopoly!',
                    color: 0x00FF00,
                    description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚',
                    fields: [{
                        name: 'Players',
                        value: this.players.map((v, i, a) => `**${i + 1}.** <@${v.id}>`).join('\n')
                    }]
                }
            }).then(msg => {
                this.message = msg;
                this.react(['🚪', '▶', '⏹', '🔚']).then(() => {
                    this.reactionAddStart = (mes, emoji, user) => {
                        let reactor = mes.channel.guild.members.get(user).user;
                        if (this.message.id === mes.id && !reactor.bot && !this.otherAction) {
                            if (emoji.name === '🚪') {
                                if (!this.players.filter(p => p.id === reactor.id)[0]) {
                                    this.addPlayer(reactor);
                                    this.message.edit({
                                        embed: {
                                            title: 'Let\'s play Monopoly!',
                                            color: 0x00FF00,
                                            description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚',
                                            fields: [{
                                                name: 'Players',
                                                value: this.players.map((v, i, a) => `**${i + 1}.** <@${v.id}>`).join('\n')
                                            }]
                                        }
                                    });
                                } else {
                                    reactor.getDMChannel().then(chnl => {
                                        chnl.createMessage({
                                            embed: {
                                                color: 0xFF0000,
                                                title: 'Error',
                                                description: 'You can\'t join a game you\'re already in!'
                                            }
                                        });
                                    });
                                }
                            } else if (emoji.name === '⏹') {
                                if (this.gameOwner === user) {
                                    this.end();
                                    this.message.edit({
                                        embed: {
                                            title: 'Game canceled',
                                            color: 0xFFFF00,
                                            description: 'See you again soon!'
                                        }
                                    }).then(() => {
                                        setTimeout(() => {
                                            this.message.delete()
                                        }, 5000);
                                    });
                                }
                            } else if (emoji.name === '▶') {
                                if (this.gameOwner === user) {
                                    if (this.players.length === 1) {
                                        this.message.edit({
                                            embed: {
                                                title: 'Monopoly is best played with two people!',
                                                color: 0xFFFF00,
                                                description: 'Right now, there is no AI for single player mode, if you want to see something like that, please support the creator on patreon https://alekeagle.com/patreon'
                                            }
                                        }).then(() => {
                                            setTimeout(() => {
                                                this.message.edit({
                                                    embed: {
                                                        title: 'Let\'s play Monopoly!',
                                                        color: 0x00FF00,
                                                        description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚',
                                                        fields: [{
                                                            name: 'Players',
                                                            value: this.players.map((v, i, a) => `**${i + 1}.** <@${v.id}>`).join('\n')
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
                                            color: 0x00FF00,
                                            description: 'To join, react with the 🚪!\nTo start, the creator of the game needs to react with ▶\nTo cancel the game, the creator of the game needs to react with ▶\nTo leave, react with 🔚 or remove your reaction to the 🚪',
                                            fields: [{
                                                name: 'Players',
                                                value: this.players.map((v, i, a) => `**${i + 1}.** <@${v.id}>`).join('\n')
                                            }]
                                        }
                                    });
                                } else reactor.getDMChannel().then(chnl => {
                                    chnl.createMessage({
                                        embed: {
                                            color: 0xFF0000,
                                            title: 'Error',
                                            description: 'You can\'t leave a game you own!'
                                        }
                                    });
                                });
                            }
                            this.message.removeReaction(emoji.name, reactor.id);
                        }
                    }
                    this.client.on('messageReactionAdd', this.reactionAddStart);
                }).catch(err => reject(err));
            });
        });
    }

    addPlayer(user) {
        return new Promise((resolve, reject) => {
            if (!this.active) {
                //creates the new user object
                let newPlayer = {
                    ...user,
                    money: 1500,
                    currentLocation: 0,
                    noJailCards: 0,
                    debtMode: false,
                    hasMortgages: false,
                    doublesInRow: 0,
                    inDebtTo: null,
                    inDebtBy: 0
                }
                //pushes the new user to the players list
                this.players.push(newPlayer);
                user.getDMChannel().then(chnl => {
                    chnl.createMessage({
                        embed: {
                            color: 0x00FF00,
                            title: 'You joined the game!',
                            description: 'quick start instructions can be found here: [MonopolyBot Instructions](https://alekeagle.com/monopolybot/instructions)'
                        }
                    }).then(() => {
                        resolve();
                    })
                }).catch(err => {
                    this.channel.createMessage(`I couldn't DM <@${player.id}> the instructions, please allow DM's and rejoin the game for instructions.`).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        });
    }

    react(emojis) {
        return new Promise((resolve, reject) => {
            //add all emojis to message
            const reactions = emojis || ['🔚', '🎲', '📧', 'bankrupt:593118614031171586', '💳', 'ℹ', '🏦'];
            for (const e of reactions) {
                this.message.addReaction(e).catch(err => reject(err));
            }
            resolve();
        });
    }

    removePlayer(player) {
        return new Promise((resolve, reject) => {
            if (!this.active) {
                this.players = this.players.filter(p => p.id !== player.id);
                player.getDMChannel().then(chnl => {
                    chnl.createMessage({
                        embed: {
                            color: 0xFFFF00,
                            title: 'You left the game!',
                            description: 'You can still rejoin before the game starts.'
                        }
                    }).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                });
            } else {
                this.players = this.players.filter(p => p.id !== player.id);
                player.getDMChannel().then(chnl => {
                    chnl.createMessage({
                        embed: {
                            color: 0xFF0000,
                            title: 'You left the game!',
                            description: 'All of your money is forfeit and you can\'t rejoin.'
                        }
                    }).then(() => {
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
            if (this.players.length < 2) {
                this.end();
                this.message.edit({
                    embed: {
                        title: 'Game Ended',
                        color: 0xFFFF00,
                        description: 'The game ended because there wasn\'t enough players to play!'
                    }
                }).then(() => {
                    setTimeout(() => {
                        this.message.delete()
                    }, 5000);
                });
            } else if (!this.players[0]) {
                this.advancePlayer();
                this.returnToReadyState('A player left!\nIt is now {{currentuser}}\'s turn!');
            }
        });
    }

    returnToReadyState(readyStateMessage) {
        return new Promise((resolve, reject) => {
            this.moving = false;
            if (this.players[0].money < 1) this.handleDebt().then(() => resolve()).catch(err => reject(err));
            this.otherAction = false;
            if (this.players[0].debtMode) {
                this.message.addReaction('💸').catch(err => reject(err));
            } else {
                this.message.removeReaction('💸').catch(err => reject(err));
            }
            this.message.edit({
                content: `<@${this.players[0].id}>`,
                embed: {
                    title: 'Monopoly',
                    color: 0x36393E,
                    description: `${readyStateMessage.replace(/{{previoususer}}/g, `<@${this.players[this.players.length - 1].id}>`).replace(/{{currentuser}}/g, `<@${this.players[0].id}>`).replace(/{{nextuser}}/g, `<@${this.players[1].id}>`)}${this.players[0].currentLocation === 'jail' ? `\n<@${this.players[0].id}> Is currently in jail! To get out of jail you must roll doubles!` : ''}`,
                    fields: [{
                        name: 'Players up next',
                        value: this.players.map((v, i, a) => `${i}. <@${v.id}>`).join('\n')
                    },
                    {
                        name: `${this.players[0].username}#${this.players[0].discriminator}'s Money`,
                        value: this.players[0].money
                    }
                    ]
                }
            }).then(() => {
                resolve();
            }).catch(err => reject(err));
        });
    }

    start() {
        this.active = true;
        this.client.off('messageReactionAdd', this.reactionAddStart);
        this.message.removeReactions().then(() => this.react().catch(err => reject(err)));
        this.message.edit({
            content: `<@${this.players[0].id}>`,
            embed: {
                title: 'Monopoly',
                color: 0x36393E,
                description: 'And we begin! Everyone starts at GO with $1500',
                fields: [{
                    name: 'Players',
                    value: this.players.map((v, i, a) => `${i}. <@${v.id}>`).join('\n')
                },
                {
                    name: `${this.players[0].username}#${this.players[0].discriminator}'s Money`,
                    value: this.players[0].money
                }
                ]

            }
        }).catch(err => reject(err));
        this.reactionAddGame = (mes, emoji, user) => {
            let reactor = mes.channel.guild.members.get(user).user;
            if (this.message.id === mes.id && !reactor.bot) {
                switch (emoji.name) {
                    case '🔚':
                        if (this.players.filter(p => p.id === reactor.id)[0]) {
                            this.removePlayer(reactor).then(() => this.message.removeReaction('🔚', reactor.id).catch(err => reject(err))).catch(err => reject(err));
                        } else reactor.getDMChannel().then(chnl => {
                            chnl.createMessage({
                                embed: {
                                    color: 0xFF0000,
                                    title: 'Error',
                                    description: 'You can\'t leave a game that you\'re not in!'
                                }
                            }).catch(err => reject(err));
                        }).catch(err => reject(err));
                        break;
                    case '🎲':
                        if (this.players[0].id === reactor.id && !this.otherAction && !this.moving) {
                            if (!this.players[0].debtMode) {
                                this.movePlayer().then(string => this.returnToReadyState(string)).catch(err => reject(err));
                            } else {
                                let messageDescription = this.channel.messages.get(this.message.id).embeds[0].description;
                                this.message.edit({
                                    embed: {
                                        title: 'Monopoly',
                                        color: 0xFFFF00,
                                        description: 'You can\'t move when you are in debt!'
                                    }
                                }).then(() => {
                                    setTimeout(() => {
                                        this.message.edit({
                                            embed: {
                                                title: 'Monopoly',
                                                color: 0x36393E,
                                                description: messageDescription,
                                                fields: [{
                                                    name: 'Players',
                                                    value: this.players.map((v, i, a) => `${i}. <@${v.id}>`).join('\n')
                                                },
                                                {
                                                    name: `${this.players[0].username}#${this.players[0].discriminator}'s Money`,
                                                    value: this.players[0].money
                                                }
                                                ]
                                            }
                                        }).catch(err => reject(err));
                                    }, 8000);
                                }).catch(err => reject(err));
                            }
                        }
                        break;
                    case '📧':
                        if (this.players[0].id === reactor.id && !this.otherAction && !this.moving) {
                            this.handleTrading().then(string => this.returnToReadyState(string)).catch(err => reject(err));
                        }
                        break;
                    case 'bankrupt':
                        if (this.players[0].id === reactor.id && !this.otherAction && !this.moving) {
                            if (!this.players[0].debtMode) {
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
                                                color: 0x36393E,
                                                description: messageDescription,
                                                fields: [{
                                                    name: 'Players',
                                                    value: this.players.map((v, i, a) => `${i}. <@${v.id}>`).join('\n')
                                                },
                                                {
                                                    name: `${this.players[0].username}#${this.players[0].discriminator}'s Money`,
                                                    value: this.players[0].money
                                                }
                                                ]
                                            }
                                        });
                                    }, 8000);
                                });
                            } else {
                                this.handleAuction(this.map.filter(p => p.ownedBy === this.players[0].id), 'bank');
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
                                        fields: [{
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
                        } else {
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
                    case '💳':
                        if (this.players[0].id === reactor.id && !this.otherAction && !this.moving) {
                            this.handleMortgaging('menu');
                        }
                        break;
                    case '🏦':
                        if (this.players[0].id === reactor.id && !this.otherAction && !this.moving) {
                            this.handleBuyingSellingHousing();
                        }
                        break;
                    case '💸':
                        if (this.players[0].id === reactor.id && !this.otherAction && !this.moving) {
                            if (this.players[0].debtMode) {
                                if (this.players[0].money > this.players[0].inDebtBy) {
                                    if (this.players[0].inDebtTo === 'bank') {
                                        this.players[0].money -= this.players[0].inDebtBy;
                                        this.players[0].inDebtTo = null;
                                        this.players[0].inDebtBy = 0;
                                        this.players[0].debtMode = false;
                                        this.advancePlayer().then(() => resolve('{{previoususer}} just paid off his debt to the bank.\n it is now {{currentuser}}\'s turn!'));
                                    }
                                }else {

                                }
                            }
                        }
                }
                this.message.removeReaction(emoji.name === 'bankrupt' ? `${emoji.name}:${emoji.id}` : emoji.name, reactor.id);
            }
        }
        this.client.on('messageReactionAdd', this.reactionAddGame);
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
        return new Promise((resolve, reject) => {
            this.moving = true;
            let die1, die2;
            if (moveTo) {
                die1 = moveTo / 2;
                die2 = moveTo / 2;
            } else {
                this.message.edit({
                    content: `<@${this.players[0].id}>`,
                    embed: {
                        title: 'Monopoly',
                        color: parseInt('36393E', 16),
                        description: 'Rolling the dice..',
                        fields: [{
                            name: `${this.players[0].username}#${this.players[0].discriminator}'s Money`,
                            value: this.players[0].money
                        }]
                    }
                }).then(() => {
                    die1 = random(1, 6);
                    die2 = random(1, 6);

                    setTimeout(() => {
                        if (this.players[0].currentLocation === 'jail') {
                            if (die1 === die2) {
                                this.players[0].currentLocation = 10;
                                this.advancePlayer();
                                this.returnToReadyState('{{previoususer}} got out of jail, while they\'re waiting for their turn, they\'re taking a nice stroll around jail!\nIt\'s {{currentuser}}\'s turn now!');
                            } else {
                                this.advancePlayer();
                                this.returnToReadyState('Its not {{previoususer}}\'s lucky day becuase they are still in jail!\nIt\'s {{currentuser}}\'s turn now!');
                            }
                        } else {
                            this.message.edit({
                                content: `<@${this.players[0].id}>`,
                                embed: {
                                    title: 'Monopoly',
                                    color: parseInt('36393E', 16),
                                    description: 'Moving..',
                                    fields: [{
                                        name: `${this.players[0].username}#${this.players[0].discriminator}'s Money`,
                                        value: this.players[0].money
                                    },
                                    {
                                        name: 'Die 1',
                                        value: die1
                                    },
                                    {
                                        name: 'Die 2',
                                        value: die2
                                    }
                                    ]
                                }
                            }).then(() => {
                                setTimeout(() => {
                                    if (this.players[0].currentLocation !== 'jail' && !this.players[0].debtMode) {
                                        if (die1 === die2) {
                                            if (++this.players[0].doublesInRow < 2) {
                                                this.players[0].doublesInRow = 0;
                                                this.players[0].currentLocation = 'jail';
                                                this.advancePlayer().then(() => {
                                                    this.returnToReadyState('{{previoususer}} is now under arrest for suspicion of cheating, that\'ll teach them to rig the dice to roll too many doubles!\nIt\'s {{currentuser}}\'s turn now!').then(() => resolve()).catch(err => reject(err));
                                                });
                                            }
                                        } else {
                                            this.players[0].doublesInRow = 0;
                                            this.players[0].currentLocation++
                                            for (let i = 0; i <= (die1 + die2); i++) {
                                                if (i < (die1 + die2)) {
                                                    if (this.players[0].currentLocation === 38) this.players[0].currentLocation = 0;
                                                    if (this.map[this.players[0].currentLocation].type === 'special') this.handleSpecialMapLocation(this.map[this.players[0].currentLocation], 'pass').catch(err => reject(err));
                                                } else {
                                                    if (--this.players[0].currentLocation === -1) this.players[0].currentLocation = this.map.length - 1;
                                                    if (this.map[this.players[0].currentLocation].type === 'special') this.handleSpecialMapLocation(this.map[this.players[0].currentLocation], 'land').then(string => resolve(string)).catch(err => reject(err));
                                                    else this.handleMapLocation(this.map[this.players[0].currentLocation]).then(string => resolve(string)).catch(err => reject(err));
                                                }
                                                if (i < (die1 + die2)) {
                                                    if (++this.players[0].currentLocation === this.map.length) this.players[0].currentLocation = 0;
                                                }
                                            }
                                        }
                                    }
                                }, 2000);
                            }).catch(err => reject(err));
                        }
                    }, 2000);
                }).catch(err => reject(err));
            }
        });
    }

    handleSpecialMapLocation(location, type) {
        return new Promise((resolve, reject) => {
            try {
                if (type === 'pass') {
                    if (typeof location.actions.pass === 'number') {
                        this.players[0].money += location.actions.pass;
                        resolve();
                    };
                } else if (type === 'land') {
                    if (typeof location.actions.land === 'number') {
                        this.players[0].money += location.actions.land;
                        if (die1 === die2) {
                            resolve(`{{currentuser}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land.toString().replace(/-/g, '')}!\nThey also rolled a double, so they go again!`);
                        } else {
                            this.advancePlayer().then(() => resolve(`{{previoususer}} landed on ${location.name} and you ${location.actions.land < 0 ? 'lost' : 'gained'} $${location.actions.land.toString().replace(/-/g, '')}!\nIt is now {{currentuser}}\'s turn!`));
                        }
                    } else if (typeof location.actions.land === 'string') {
                        switch (location.actions.land) {
                            case 'comchest':
                                let comchest = communityChest[random(0, communityChest.length - 1)]
                                this.handleCards(comchest, 'Community Chest').then(() => resolve());
                                break;
                            case 'chance':
                                let chancecrd = chance[random(0, chance.length - 1)]
                                this.handleCards(chancecrd, 'Chance Pile').then(() => resolve());
                                break;
                            case 'tojail':
                                this.players[0].currentLocation = 'jail';
                                this.advancePlayer().then(() => resolve(`{{previoususer}} landed on the "Go to jail" space! They are now in jail!\nIt is now {{currentuser}}\'s turn!`));
                                break;
                            case 'freeparking':
                                if (die1 === die2) {
                                    resolve(`{{currentuser}} found one more free spot in the Free Parking lot!\nThey also rolled a double, so they go again!`);
                                } else {
                                    this.advancePlayer().then(() => resolve(`{{previoususer}} found one more free spot in the Free Parking lot!\nIt is now {{currentuser}}\'s turn!`));
                                }
                                break;
                            case 'visitingjail':
                                if (die1 === die2) {
                                    resolve(`{{currentuser}} decided he might want to purchase the jail, so he paid it a visit! (he wasn't intrested)\nThey also rolled a double, so they go again!`);
                                } else {
                                    this.advancePlayer().then(() => resolve(`{{previoususer}} decided he might want to purchase the jail, so he paid it a visit! (he wasn't intrested)\nIt is now {{currentuser}}\'s turn!`));
                                }
                                break;
                        }
                    }
                }
            }catch (err) {
                reject(err);
            }
        });
    }

    handleMapLocation(location, die1, die2) {
        return new Promise((resolve, reject) => {
            if (location.ownedBy && location.ownedBy === this.players[0].id) {
                if (die1 === die2) {
                    resolve(`{{currentuser}} landed on their own property ${location.name}!\nThey also rolled a double, so they go again!`);
                } else {
                    this.advancePlayer().then(() => resolve(`{{previoususer}} landed on their own property ${location.name}!\nIt is now {{currentuser}}\'s turn!`));
                }
            } else if (location.ownedBy && location.ownedBy !== this.players[0].id) {
                this.handleRent(location, die1, die2).then();
            } else if (!location.ownedBy) {
                this.handlePurchase(location, die1, die2);
            }
        });
        
    }
}

module.exports = {
    games,

    Game: GameBeta
}