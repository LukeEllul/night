const Nightmare = require('nightmare');
require('trina');
const { List } = require('immutable');
const R = require('ramda');
const get = require('get-parameter-names');

const NightmareOptions = {
    show: true,
    waitTimeout: 30000
}

const nightmare = Nightmare(NightmareOptions);

const night = (...commands) => {
    const nextFn = (...args) => fn => {
        const isFunction = typeof fn === 'function';

        const thisFn = nightmare => {
            let flag = false;
            if(nightmare === 'has nightmare finished') return flag;
            const thisNightmare = nightmare.constructor === Array ?
                nightmare[0] : nightmare;
            const resolutionFn = resolution => v => {
                flag = true;
                const result = isFunction ? fn(v,nightmare[1]) : v;
                const rFn = r => resolution([thisNightmare, r]);
                return result && result.then ? 
                    result.then(rFn, rFn) : resolution([thisNightmare, result]);
            }
            return new Promise((res, rej) => 
                thisNightmare[commands[0]](...args)
                .then(resolutionFn(res),resolutionFn(rej)));
        }
        return isFunction ? thisFn : thisFn(fn);
    }
    return commands.length === 1 ? nextFn : nextFn(...commands.slice(1));
}