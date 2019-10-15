const s3 = require('./s3Config.js');
const BUCKET = require("config").get("bucket");

function promiseUpload(s3, params) {
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

async function uploadImageToS3(data, type) {
    try {
        let key = Date.now() + "_" + parseInt(Math.random() * 1000) + "." + type;
        let params = {
            Bucket: BUCKET,
            Key: key,
            Body: data
        };
        await promiseUpload(s3, params);
        return key;
    } catch (err) {
        console.log("uploadImageToS3", err.message);
    }
}


module.exports = uploadImageToS3;