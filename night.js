const Nightmare = require('nightmare');
require('trina');
const { List } = require('immutable');
const R = require('ramda');

const NightmareOptions = {
    show: true,
    waitTimeout: 30000
}

const nightmare = Nightmare(NightmareOptions);

// nightmare
// .goto('https://www.google.com')
// .then(function(){
//     console.log('page has loaded');
//     console.log('waiting');
//     nightmare.wait(3000)
//     .then(function(){
//         nightmare.goto('https://www.pornhub.com')
//         .then(console.log)
//     })
// });

// const night = command => (...args) => fn => {
//     const isFunction = typeof fn === 'function';
//     const thisFn = nightmare => {
//         let thisNightmare = nightmare.constructor === Array ?
//             nightmare[0] : nightmare;
//         return new Promise((res, rej) =>
//             thisNightmare[command](...args)
//                 .then(
//                 v => res([thisNightmare, isFunction ? fn(v, nightmare[1]) : v]),
//                 err => rej([thisNightmare, isFunction ? fn(err, nightmare[1]) : err])
//                 ))
//     }

//     return isFunction ? thisFn : thisFn(fn);
// }

const night = (...commands) => {
    const nextFn = (...args) => fn => {
        const isFunction = typeof fn === 'function';

        const thisFn = nightmare => {
            const thisNightmare = nightmare.constructor === Array ?
                nightmare[0] : nightmare;
            const resolutionFn = resolution => v => {
                const result = isFunction ? fn(v,nightmare[1]) : v;
                const rFn = r => resolution([thisNightmare, r]);
                return result && result.then ? result.then(rFn, rFn) : resolution([thisNightmare, result]);
            }
            return new Promise((res, rej) => 
                thisNightmare[commands[0]](...args).then(resolutionFn(res),resolutionFn(rej)));
        }

        return isFunction ? thisFn : thisFn(fn);
    }

    return commands.length === 1 ? nextFn : nextFn(...commands.slice(1));
}

trina(
    night('goto','https://www.google.com')(v => {
        console.log('waiting for promise');
        return new Promise(res => setTimeout(() => res('paws'), 7000));
    }), AND,
    night('goto', 'https://www.pornhub.com')((v, j) => {
        console.log(j);
        return j;
    }), AND,
    night('wait')(3000)((v, j) => console.log(j)), AND,
    () => console.log('done')
)(nightmare);

// night('goto')('https://www.google.com')(nightmare)
// .then(v => console.log(v));