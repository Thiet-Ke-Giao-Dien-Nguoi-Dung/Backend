const s3 = require('./s3Config.js');
const BUCKET = require("config").get("bucket");
const Jimp = require("jimp");

async function resize(image, width, height) {
    image = await Jimp.read(image);

    return image
        .resize(width, height)
        .quality(60)
        .getBufferAsync(Jimp.AUTO);
}

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
        let img = await resize(data, 50, 50);
        let key = Date.now() + "_" + parseInt(Math.random() * 1000) + "." + type;
        let params = {
            Bucket: BUCKET,
            Key: key,
            Body: img
        };
        await promiseUpload(s3, params);
        return key;
    } catch (err) {
        console.log("uploadImageToS3", err.message);
    }
}


module.exports = uploadImageToS3;