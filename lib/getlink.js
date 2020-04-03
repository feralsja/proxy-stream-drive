'use strict'

const request = require('request');
const qs = require('querystring')

module.exports = fileId => {

    return new Promise(async resolve => {

        request('https://drive.google.com/get_video_info?docid=' + fileId, (err, resp, body) => {
            if (err || !resp || resp.statusCode != 200 || !body)
                return resolve(null);

            var result = {
                cookie: resp.headers['set-cookie']
            };

            var query = qs.parse(body);
            if (query.status !== 'ok')
                return resolve(null);

            result.sources = query.fmt_stream_map
                .split(',')
                .map(itagAndUrl => {
                    const [itag, url] = itagAndUrl.split('|')
                    return {
                        label: getVideoResolution(itag),
                        file: url
                    }
                })
                .filter(video => video.label !== 0);

            if (!result.sources.length)
                return resolve(null);

            return resolve(result);
        })
    })
}

function getVideoResolution(itag) {
    const videoCode = {
        '18': '360p',
        '59': '480p',
        '22': '720p',
        '37': '1080p'
    };

    return videoCode[itag] || 0;
}