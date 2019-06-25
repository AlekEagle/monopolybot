'use strict';

const logic = require('../functions/gameLogic');

module.exports = {
    name: 'test',

    exec: (client, msg, args) => {
        new logic.Game(client, msg);
    }
}