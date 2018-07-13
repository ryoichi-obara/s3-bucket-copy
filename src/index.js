const AWS = require('aws-sdk');
// const moment = require('moment-timezone');

// For devlocal
// const credentials = new AWS.SharedIniFileCredentials({ profile: '' });
// AWS.config.credentials = credentials;

const S3 = new AWS.S3();

const { FROM_BUCKET } = process.env;
const { TO_BUCKET } = process.env;

/**
 * Implement your conditional code.
 * @param {string} key S3 Bucket key name
 */
const isCopyTarget = (key) => {
  if (key) {
    return true;
  }
  return false;
};

/**
 * main
 * @param {*} event
 */
exports.handler = async (event) => {
  // console.log(JSON.stringify(event));

  const params = { Bucket: FROM_BUCKET };
  do {
    const data = await S3.listObjectsV2(params).promise();
    await Promise.all(
      data.Contents.filter(content => isCopyTarget(content.Key)).map(e => S3.copyObject({
        Bucket: TO_BUCKET,
        CopySource: `${FROM_BUCKET}/${e.Key}`,
        Key: e.Key,
      }).promise()),
    );

    // Name: 'bucket.name',
    // Prefix: '',
    // MaxKeys: 1000,
    // CommonPrefixes: [],
    // KeyCount: 1000,
    // NextContinuationToken: '1xaDw9pQqvhAuXiUwnhiRM6bgm2MCyQ/+T4H7PhPB6KLD69OHPWMdPxma5rguqZ/J5+QUjScYtJYVLswa1SaoIRXCdi/d9exH1++R9lAYQGOmORabyv5KqD7y66ftZzJe0x7sQ4vgup+FEBnhnIIL4='

    if (data.NextContinuationToken) {
      params.ContinuationToken = data.NextContinuationToken;
    } else {
      break;
    }
  } while (true);
};
