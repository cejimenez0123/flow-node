const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: `../${process.env.keyFilename}`
  });
  
  async function createBucket(bucketName) {
    try {
      const {bucket} = await storage.bucket(bucketName);
      console.log(`Bucket ${bucketName} created.`);
      return bucket; // Optionally return the bucket object for further use
    } catch (error) {
      console.error('Error creating bucket:', error);
      // Handle the error appropriately (e.g., throw, log, retry)
    }
  }
  

//   createBucket(process.env.BUCKET_NAME)
//     .then(bucket => {

//     })
//     .catch(error => {
     
//     });
  
  module.exports = createBucket;