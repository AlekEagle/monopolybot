'use strict';
const u_wut_m8 = require('../.auth.json');
const Logger = require('./logger');
const console = new Logger();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`postgres://alekeagle:${u_wut_m8.serverPass}@127.0.0.1:5432/alekeagle`, {
    logging: false
});
class GBlacklist extends Sequelize.Model {};
GBlacklist.init({
    userId: Sequelize.STRING
}, {
    sequelize
});
GBlacklist.sync({
    force: false
}).then(() => {
    console.log('GBlacklist synced to database successfully!');
}).catch(err => {
    console.error('an error occured while proforming this operation');
    console.error(err);
});

module.exports = {
    gblacklist: {
        users: []
    },

    manageBlacklist: (value) => {
        return new Promise((resolve, reject) => {
            switch (value.action) {
                case 'add':
                    switch (value.blklist) {
                        case 'gblk':
                            module.exports.gblacklist.users.push(value.id);
                            GBlacklist.create({
                                userId: value.id
                            }).then(() => {
                                resolve(module.exports.gblacklist.users.length);
                            }, err => {
                                reject(err);
                                console.error(err);
                            });
                        break;
                        default: 
                            reject(`${value.blklist} does not exist.`);
                        break;
                    }
                    break;
                case 'refresh':
                    switch (value.blklist) {
                        case 'gblk':
                            GBlacklist.findAll().then(gBlacklistContents => {
                                gBlacklistContents.forEach(e => {
                                    module.exports.gblacklist.users.push(e.userId);
                                });
                                resolve(module.exports.gblacklist);
                            }, err => {
                                reject(err);
                                console.log(err);
                            });
                        break;
                        default: 
                            reject(`${value.blklist} does not exist.`);
                        break;
                    }
                    break;
                case 'remove':
                    switch (value.blklist) {
                        case 'gblk':
                            module.exports.gblacklist.users = module.exports.gblacklist.users.filter(u => u !== value.id)
                            GBlacklist.findOne({
                                where: {
                                    userId: value.id
                                }
                            }).then(user => {
                                user.destroy().then(() => {
                                    resolve(module.exports.gblacklist.users.length);
                                })
                            }, err => {
                                reject(err);
                                console.log(err);
                            });
                        break;
                        default: 
                            reject(`${value.blklist} does not exist.`);
                        break;
                    }
                break;
                default: 
                    reject(`${value.action} does not exist.`);
                break;
            }
        });
    }
}