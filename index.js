const CommandClient = require('eris-command-handler'),
env = process.env,
fs = require('fs'),
u_wut_m8 = require('./.auth.json'),
Logger = require('./functions/logger'),
console = new Logger(),
nums = require('./functions/numbers'),
manager = require('./functions/blacklistManager'),
stats = require('./functions/commandStatistics'),
owners = require('./functions/getOwners'),
prefixes = require('./functions/managePrefixes'),
shards = require('./functions/shardManager');
let i = 0;
manager.manageBlacklist({action: 'refresh', blklist: 'gblk'}).then(list => {
    console.log(`Loaded global user blacklist. There are currently ${list.users.length} user entry(s).`);
}, err => {
    console.error(err);
});
owners.initializeOwners().then(list => {
    console.log(`Loaded owners. There are currently ${list.users.length} owners.`)
});
function nextShard() {
    console.log(`Connecting to shard ${i}`);
    const client = new CommandClient(env.DEBUG ? u_wut_m8.otherToken : u_wut_m8.token, {
        firstShardID: i,
        lastShardID: i,
        maxShards: nums.shardCount,
        getAllUsers: true
    }, {
        description: 'A FULL REWRITE OF THE CODE IS HAPPENING SOON PLEASE STAY TUNED',
        owner: 'AlekEagle#0001',
        prefix: env.DEBUG ? 'Alexa, ' : 'm!'
    });
    client.on('ready', () => {
        if (i < nums.shardCount) {
            prefixes.managePrefixes({action: 'refresh', client}).then(prefixes => {
                console.log(`Loaded ${prefixes.length} guild prefix(es).`);
            });
            prefixes.on('newPrefix', (id, prefix) => client.registerGuildPrefix(id, prefix));
            prefixes.on('removePrefix', id => delete client.guildPrefixes[id]);
            prefixes.on('updatePrefix', (id, prefix) => client.guildPrefixes[id] = prefix);
            shards.connectShard(client.options.firstShardID, client);
            console.log(`Connected to shard ${client.options.firstShardID}`);
            let http = require('http'),
            app = require('express')(),
            server = http.createServer(app);
            app.get('/reloadcmds', (req, res) => {
                Object.values(client.commands).map(c => c.label).filter(c => c !== 'help').forEach(c => {
                    client.unregisterCommand(c);
                });
                var commands = fs.readdirSync('./cmds');
                console.log(`Loading ${commands.length} commands, please wait...`)
                commands.forEach(c => {
                    delete require.cache[require.resolve(`./cmds/${c}`)]
                    var cmdFile = require(`./cmds/${c}`);
                    stats.initializeCommand(cmdFile.name);
                    client.registerCommand(cmdFile.name, (msg, args) => {
                        stats.updateUses(cmdFile.name);
                        if (!manager.gblacklist.users.includes(msg.author.id)) {
                            cmdFile.exec(client, msg, args);
                        }else {
                            msg.author.getDMChannel().then(chn => {
                                chn.createMessage('You have been blacklisted from MonopolyBot! If you think this is a mistake, please go here https://alekeagle.tk/discord and ask AlekEagle#0001 about this issue.').catch(() => {
                                    msg.channel.createMessage(`<@${msg.author.id}> You have been blacklisted from MonopolyBot! If you think this is a mistake, please go here https://alekeagle.tk/discord and ask AlekEagle#0001 about this issue.`)
                                })
                            })
                        }
                    }, cmdFile.options)
                });
                res.end('{ "success": true }')
            });
            app.get('/reloadevts', (req, res) => {
                client.eventNames().forEach(e => {
                    if (e !== 'ready') {
                        var eventlisteners = client.rawListeners(e);
                        if (e === 'messageReactionAdd' || e === 'messageReactionRemove' || e === 'messageCreate') {
                            eventlisteners = eventlisteners.slice(1);
                        }
                        eventlisteners.forEach(ev => {
                            client.removeListener(e, ev);
                        })
                        
                    }
                });
                var events = fs.readdirSync('./events');
                console.log(`Loading ${events.length} events, please wait...`);
                events.forEach(e => {
                    delete require.cache[require.resolve(`./events/${e}`)];
                    var eventFile = require(`./events/${e}`);
                    client.on(eventFile.name, (...args) => {
                        eventFile.exec(client, ...args);
                    });
                });
            });
            server.listen(parseInt(`372${i}`));
        }
        if (i < nums.shardCount) {
            i ++
            if (i < nums.shardCount) nextShard();
        }
    });
    var events = fs.readdirSync('./events');
    console.log(`Loading ${events.length} events, please wait...`);
    events.forEach(e => {
        var eventFile = require(`./events/${e}`);
        client.on(eventFile.name, (...args) => {
            eventFile.exec(client, ...args);
        });
    });
    var commands = fs.readdirSync('./cmds');
    console.log(`Loading ${commands.length} commands, please wait...`);
    commands.forEach(c => {
        var cmdFile = require(`./cmds/${c}`);
        stats.initializeCommand(cmdFile.name);
        client.registerCommand(cmdFile.name, (msg, args) => {
            stats.updateUses(cmdFile.name);
            if (!manager.gblacklist.users.includes(msg.author.id)) {
                cmdFile.exec(client, msg, args);
            }else {
                msg.author.getDMChannel().then(chn => {
                    chn.createMessage('You have been blacklisted from MonopolyBot! If you think this is a mistake, please contact AlekEagle#0001').catch(() => {
                        msg.channel.createMessage(`<@${msg.author.id}> You have been blacklisted from MonopolyBot! If you think this is a mistake, please contact AlekEagle#0001`);
                    });
                });
            }
        }, cmdFile.options);
    });
    client.connect();
}
nextShard();
