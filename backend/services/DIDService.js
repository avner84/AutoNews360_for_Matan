const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const { D_ID_API_KEY } = require("../config/vars");


const sofiaImageUrl =
  "https://create-images-results.d-id.com/google-oauth2%7C113228135334831093217/upl_EEY93HJXprfY-QhMSFjcv/image.png";
const jackImageUrl =
  "https://create-images-results.d-id.com/google-oauth2%7C113228135334831093217/upl_re6eFAc5DzF8ooqhvqDyg/image.png";

const videoPath = path.join(__dirname, "..", "tempVideos", "video.mp4");

//A function for creating a video clip using the D-ID service.
//This function consists of two parts: sending a POST request with relevant information for the video creation that returns an ID, and the second part involves sending a GET request to retrieve the video using the ID
async function createVideo(title, avatar) {
    console.log("+-+-+-+-start createVideo-+-+-+-+");
  // Setting the URL and voice_id based on the avatar
  const source_url = avatar === "Sofia" ? sofiaImageUrl : jackImageUrl;
  const voice_id = avatar === "Sofia" ? "en-US-JennyNeural" : "en-US-GuyNeural";

  try {
     // Sending a POST request to D-ID to create a video
    console.log("URL for POST request:", "https://api.d-id.com/talks");
    let response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        Authorization: `Basic ${D_ID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url,
        script: {
          type: "text",
          input: title, // Using the received title as input
          provider: {
            type: "microsoft",
            voice_id, // Use the defined voice_id variable
            voice_config: {
              style: "Newscast",
            },
          },
        },
        config: {
          stitch: true,
        },
      }),
    });

    console.log("Response status code:", response.status);
    let data = await response.json();

    if (response.status !== 201) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    console.log("Response data from POST request:", data);

    if (!data || !data.id) {
      throw new Error("Video ID is undefined in the response");
    }

    let videoId = data.id; // Saving the video ID

    // Waiting for the video creation to finish (can be improved with a more advanced mechanism)
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Waiting for 30 seconds

     // Sending a GET request to retrieve the video
    console.log(
      "URL for GET request:",
      `https://api.d-id.com/talks/${videoId}`
    );
    response = await fetch(`https://api.d-id.com/talks/${videoId}`, {
      headers: {
        Authorization:
          `Basic ${D_ID_API_KEY}`,
      },
    });

    data = await response.json();

    console.log("Response data from GET request:", data);

    if (!data || !data.result_url) {
      throw new Error("Result URL is undefined in the response");
    }

   // Downloading the video
    const videoUrl = data.result_url; // The URL of the video
    console.log("Video URL for download:", videoUrl);
    const videoResponse = await fetch(videoUrl);
    const videoBuffer = await videoResponse.buffer();

   fs.writeFileSync(videoPath, videoBuffer);

    console.log("Video downloaded successfully to:", videoPath);
    return { status: true, message: "Video created successfully" };
  } catch (error) {
    console.error("Error occurred:", error);
    return { status: false, message: error.message };
  }
}


module.exports = createVideo;