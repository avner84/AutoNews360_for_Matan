const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
// Import AWS access keys from the configuration file
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_URL } = require("../config/vars");

// Define the path to the temporary video file
const videoPath = path.join(__dirname, "..", "tempVideos", "video.mp4");

// Configure AWS with the provided credentials and region
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "il-central-1",
});
const s3 = new AWS.S3(); // Create a new S3 instance

// Function to upload a video file to Amazon S3
async function uploadToS3(articleId) {
  console.log("+-+-+-+-start uploadToS3-+-+-+-+");

   // Define the S3 key for the video based on the article ID
  const videoKey = `video_id_${articleId}`;
  // Construct the URL for the uploaded video on S3
  const s3Url = S3_BUCKET_URL + videoKey;

 // Check if the video file exists before attempting to upload
  if (!fs.existsSync(videoPath)) {
    console.error("Video file does not exist:", videoPath);
    return null;
  }

  try {
     // Reading the video file from the file system
    const fileContent = fs.readFileSync(videoPath);

    // Uploading the video file to S3
    const params = {
      Bucket: "autonews360-test", // S3 bucket name
      Key: videoKey, // The name of the file to be saved in S3
      Body: fileContent, // The content of the file
    };

    await s3.upload(params).promise(); // Perform the upload
    console.log(`File uploaded successfully to ${s3Url}`);

    // Delete the local video file after successful upload
    fs.unlinkSync(videoPath);
    console.log(`Deleted local file: ${videoPath}`);

    return s3Url; // Return the URL of the uploaded video
  } catch (error) {
    console.error("Error uploading video to S3:", error);
    return null; // Return null in case of an error
  }
}

module.exports = uploadToS3;
