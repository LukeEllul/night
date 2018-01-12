const { night } = require('../night');
const {trina} = require('trina');

trina(
    night('goto', google)((v, j, f) => (console.log(f), f))
        (f => (console.log(f), f)), AND,
    evaluate(() => document.querySelector('div.jsb center input').value)
        ((v, j) => (console.log(v), console.log('now flag is ' + j)))
)
    (nightmare);