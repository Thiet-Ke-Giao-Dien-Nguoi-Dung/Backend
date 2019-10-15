const config = require("config");
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: config.get('secretAccessKey'),
    accessKeyId: config.get('accessKeyId')
});

const s3 = new aws.S3();

module.exports = s3;