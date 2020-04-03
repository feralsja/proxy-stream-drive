'use strict'

const request = require('request');

module.exports = (req, res) => {

    var url = req.query.url || null;
    var cookie = req.query.cookie || null;
    if(!url || !cookie) return res.end();

    url = new Buffer.from(url, 'base64').toString('ascii');
    cookie = JSON.parse(new Buffer.from(cookie, 'base64').toString('ascii'));
    
    if(!url || !cookie) return res.end();

    const headers = Object.assign(req.headers, { cookie });

    delete headers.host;
    delete headers.referer;

    var stream = request({ url, headers });

    stream.on('response', resp => {
        res.statusCode = resp.statusCode;
        Object.keys(resp.headers).forEach(key => {
            res.setHeader(key, resp.headers[key])
        });
    });

    stream.pipe(res);

    res.on('close', () => {
        stream.abort();
    });
}