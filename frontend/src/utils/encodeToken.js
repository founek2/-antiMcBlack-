/**
 * create single token from username and passwd
 * @param {String} username 
 * @param {String} password
 */

export default function(a, b) {
    var d, c = (255 * Math.random() ^ 255 * Math.random() + 255 * Math.random()) & 255, e = 15 < c ? c.toString(16) : "0" + c.toString(16);
    a = ":" + a + ":" + b + ":" + Date.now();
    b = 10 + 10 * Math.random();
    for (d = ""; d.length < b; )
        d += "./abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(64 * Math.random());
    a = d + a;
    for (b = 0; b < a.length; b++)
        d = a.charCodeAt(b) ^ c,
        e += 15 < d ? d.toString(16) : "0" + d.toString(16),
        d = (c & 1 ^ 1) << 7,
        c = c >> 1 & 127 | d;
    return e
}