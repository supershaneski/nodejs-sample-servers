
// getIPAddress
// Get the IP address where project is running
// Source: https://stackoverflow.com/a/15075395
exports.getIPAddress = () => {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
            return alias.address;
        }
    }
    return '0.0.0.0';
}

// Get client IP address from the request object
exports.getIPFromReq = ( req ) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip.replace(/^.*:/, '');  
}

exports.writeLog = ( msg ) => {
    console.log((new Date()).toLocaleTimeString() + " " + msg);
}

// getSimpleId
// Source: https://stackoverflow.com/a/46352326
exports.getSimpleId = () => {
    return Math.random().toString(26).slice(2);
}
/*
console.log(Buffer.from("Hello World").toString('base64'));
console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
console.log(Buffer.from('Hello World', 'utf8').toString('hex'));
*/

// getUniqueId
// Source: https://stackoverflow.com/a/57593036
exports.getUniqueId = () => {
    return (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
}
/*
const crypto = require("crypto");
const id = crypto.randomBytes(16).toString("hex");
console.log(id);
*/

exports.getUniqueId2 = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
}

// Source: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
exports.getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
exports.getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
   * Check if `prefix` satisfies a `path`.
   * Returns the new path.
   *
   * match('/images/', '/lkajsldkjf') => false
   * match('/images', '/images') => /
   * match('/images/', '/images') => false
   * match('/images/', '/images/asdf') => /asdf
   *
   * @param {String} prefix
   * @param {String} path
   * @return {String|Boolean}
   * @api private
   */

   /**
   * Check if `prefix` satisfies a `path`.
   * Returns the new path.
   *
   * match('/images/', '/lkajsldkjf') => false
   * match('/images', '/images') => /
   * match('/images/', '/images') => false
   * match('/images/', '/images/asdf') => /asdf
   *
   * @param {String} prefix
   * @param {String} path
   * @return {String|Boolean}
   * @api private
   */
// https://github.com/koajs/mount/blob/master/index.js
exports.match = (path) => {
    const trailingSlash = '/';
    if (path.indexOf(prefix) !== 0) return false;
    const newPath = path.replace(prefix, '') || '/';
    if (trailingSlash) return newPath;

    // `/mount` does not match `/mountlkjalskjdf`
    if (newPath[0] !== '/') return false;
    return newPath;
}