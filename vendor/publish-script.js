const chance = require('chance').Chance();
const { publishPickup } = require('./vendor.js');

publishPickup(chance.hash({length: 15}), chance.name())