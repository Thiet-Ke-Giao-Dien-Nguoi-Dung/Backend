const s3 = require('./s3Config.js');
const config = require('config');

function createUrl(key) {
    const s3Params = {
        Bucket: config.get('bucket'),
        Key: key,
        Expires: 60 * 60
    };
    return new Promise((resolve, reject) => {
        return s3.getSignedUrl('getObject', s3Params, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

module.exports = createUrl;