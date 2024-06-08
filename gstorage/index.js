const { Storage } = require('@google-cloud/storage');

// Create a Storage client instance
const storage = new Storage({projectId:process.env.PROJECT_ID});

module.exports = storage.bucket(process.env.BUCKET_NAME)
