# s3-bucket-copy

## Environment

* FROM_BUCKET
* TO_BUCKET

## Implementation

Implement your conditional code at ``src/index.js``.

```js
const isCopyTarget = (key) => {
  if (key) {
    return true;
  }
  return false;
};
```

## Release

```sh
npm run make
aws s3 cp .\build\Release\s3-bucket-copy.zip s3://${YOUR_S3_BUCKET_HERE}/
aws lambda update-function-code --function-name s3-bucket-copy --s3-bucket ${YOUR_S3_BUCKET_HERE} --s3-key s3-bucket-copy.zip --publish
```
