'use strict';

let nums = require('../functions/numbers');

module.exports = {
    name: 'messageCreate',

    exec: (client, msg) => {
        ++nums.msgsRead;
    }
}