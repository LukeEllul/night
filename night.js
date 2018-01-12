const Nightmare = require('nightmare');
require('trina');
const { List } = require('immutable');
const R = require('ramda');
const  getParameters  =  require('get-parameter-names');

const NightmareOptions = {
    show: true,
    waitTimeout: 30000
}

const google = 'https://www.google.com';

const nightmare = Nightmare(NightmareOptions);

const night = (...commands) => {
    const nextFn = (...args) => fn => {
        const isFunction = typeof fn === 'function';
        let flag = [false];
        let resultofFlagFn = null;

        const thisFn = flagFn => {
            const mainFn = nightmare => {
                const thisNightmare = nightmare.constructor === Array ?
                    nightmare[0] : nightmare;
                const resolutionFn = resolution => v => {
                    flag[0] = true;
                    const result = isFunction ? fn(v, nightmare[1], resultofFlagFn) : v;
                    const rFn = r => resolution([thisNightmare, r]);
                    return result && result.then ?
                        result.then(rFn, rFn) : resolution([thisNightmare, result]);
                }

                return new Promise((res, rej) =>
                    thisNightmare[commands[0]](...args)
                        .then(resolutionFn(res), resolutionFn(rej)));
            }

            return typeof flagFn === 'function' ? 
                (resultofFlagFn = flagFn(flag), mainFn) : mainFn(flagFn);
        }
        return isFunction ? thisFn : thisFn(fn);
    }
    return commands.length === 1 ? nextFn : nextFn(...commands.slice(1));
}

const evaluate = fn => night('evaluate', fn, ...getParameters(fn));

module.exports = {
    night
}