require("dotenv").config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    NEWSDATA_API_URL: process.env.NEWSDATA_API_URL,
    D_ID_API_KEY: process.env.D_ID_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL   
  };
  