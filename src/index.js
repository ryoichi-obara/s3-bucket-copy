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
 * @return true:copy.
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
    // List bucket objects.
    const data = await S3.listObjectsV2(params).promise();

    // Binary:
    // await Promise.all(
    //   data.Contents.filter(content => isCopyTarget(content)).map((content) => {
    //     const s3Stream = S3.getObject({
    //       Bucket: FROM_BUCKET,
    //       Key: content.Key,
    //     }).createReadStream();
    //     return S3.upload({
    //       Bucket: TO_BUCKET,
    //       Key: content.Key,
    //       Body: s3Stream,
    //     }).promise();
    //   }),
    // );

    // Text:
    await Promise.all(
      data.Contents.filter(content => isCopyTarget(content.Key)).map(content => S3.copyObject({
        Bucket: TO_BUCKET,
        CopySource: `${FROM_BUCKET}/${content.Key}`,
        Key: content.Key,
      }).promise()),
    );

    // Name: 'bucket.name',
    // Prefix: '',
    // MaxKeys: 1000,
    // CommonPrefixes: [],
    // KeyCount: 1000,
    // NextContinuationToken: '1xaDw9pQqvhAuXiUwnhiRM6bgm2MCyQ/+T4H7PhPB6KLD69OHPWMdPxma5rguqZ/J5+QUjScYtJYVLswa1SaoIRXCdi/d9exH1++R9lAYQGOmORabyv5KqD7y66ftZzJe0x7sQ4vgup+FEBnhnIIL4='

    if (data.NextContinuationToken) {
      // Continue to retrieve next 1000 objects.
      params.ContinuationToken = data.NextContinuationToken;
    } else {
      break;
    }
  } while (true);
};
