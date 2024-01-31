const fetch = require("node-fetch"); // Importing the fetch function
const { NEWSDATA_API_URL } = require("../config/vars");
const fetchAndParseArticle = require("../utils/fetchAndParseArticle");

const createVideo = require("./DIDService");
const uploadToS3 = require("./S3UploadService");

const { readLastAvatar, saveLastAvatar } = require("../utils/logger");
const { findArticle, saveNewArticle } = require("../data-access/news");

// Function to fetch and filter news articles
async function fetchAndFilterNewsArticles() {
  const response = await fetch(NEWSDATA_API_URL);
  const data = await response.json();

  // Loop for printing the titles of the articles
  console.log("The following articles were retrieved:");
  data.results.forEach((article, index) => {
    console.log(index + 1 + ". " + article.title);
  });

  //Imports the last avatar figure. This figure will be used as the avatar image saved in the article's profile
  let currentAvatar = readLastAvatar();
  let filteredArticles = [];

  for (const article of data.results) {
    const {
      title,
      link,
      description,
      pubDate,
      image_url,
      category,
      article_id,
      creator,
    } = article;

    console.log(`Checking article: ${title}`); // Log the title of the article being checked
    const existingArticle = await findArticle({
      provider_article_id: article_id,
    });

    // Check if the article doesn't exist and all required fields are present
    if (
      !existingArticle &&
      title &&
      link &&
      description &&
      pubDate &&
      image_url &&
      category
    ) {
      const content = await fetchAndParseArticle(link);

      if (!content || content.trim() === "") {
        console.log(`Article '${title}' was omitted due to lack of content.`);
        continue; // Skip the article if there's no content
      }

      const articleData = {
        title,
        link,
        content,
        description,
        image_url,
        provider_article_id: article_id,
        author: creator?.[0] || "Author not found",
        pubDate: new Date(pubDate),
        category: category[0],        
      };

      // Add the article to the list of filtered articles
      filteredArticles.push(articleData);
    } else {
      // Determine the reason for omission and log it
      let reason = "";
      if (existingArticle) {
        reason = "it already exists in the database";
      } else if (
        !title ||
        !link ||
        !description ||
        !pubDate ||
        !image_url ||
        !category
      ) {
        reason =
          "it is missing one or more required fields (title, link, description, publication date, image URL, category)";
      }
      console.log(`Article '${title}' was omitted because ${reason}.`);
    }
  }
  return filteredArticles;
}

// The main function that manages fetching articles, filtering them, creating video clips, saving the videos to S3, and storing the articles in the database
exports.manageNewsArticleProcessing = async () => {
  //Imports the last saved avatar so that if the article meets all conditions and is stored in the database, the avatar figure will be replaced
  
  try {
    const filteredArticles = await fetchAndFilterNewsArticles();
    console.log("Filtered Articles :", filteredArticles);

    for (const article of filteredArticles) {
      let currentAvatar = readLastAvatar();

      const { title, provider_article_id } = article;
      try {
        article.avatar = currentAvatar;
        //Creating a video clip of the article with the representative avatar figure
        const videoResult = await createVideo(title, currentAvatar);

        //If the status of the video creation is true, upload the video to S3
        if (videoResult.status) {
          const videoUrl = await uploadToS3(provider_article_id);

          //If the video has been successfully uploaded to S3 and a URL with the video's location is returned, the article will be saved in the database
          if (videoUrl) {
            article.avatarVideoUrl = videoUrl;
            await saveNewArticle(article);
            // Alternating the avatar
            
            currentAvatar = currentAvatar === "Sofia" ? "Jack" : "Sofia";
            saveLastAvatar(currentAvatar); // Save the current state of the avatar
          } else {
            console.log(`Video for article: ${title} failed to upload to S3.`);
          }
        } else {
          console.log(`Failed to create video for article: ${title}`);
        }
      } catch (error) {
        console.error(`Error processing article '${title}': ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error fetching and saving news:", error);
  }
};
