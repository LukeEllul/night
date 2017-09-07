const Nightmare = require('nightmare');
require('trina');
const { List } = require('immutable');
const R = require('ramda');

const NightmareOptions = {
    show: true,
    waitTimeout: 30000
}