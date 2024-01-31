const News = require("../models/news");

// Function to find a single article based on a query
const findArticle = async (query) => {
  try {
    return await News.findOne(query);
  } catch (error) {
    throw error;
  }
}

// Function to save a new article with the provided data
const saveNewArticle = async (articleData) => {
  try {
    const newArticle = new News(articleData);
    await newArticle.save();
    console.log(`Video for article: ${articleData.title} successfully saved in the database`);
    return newArticle;
  } catch (error) { 
    throw error;
  }
}

// Function to find the latest articles with an optional limit
const findLatestArticles = async (limit = 10) => {
  // Fetch articles from the database, sorted by publication date in descending order.
    // Limit the number of articles returned (default is 10).
    // Exclude the content field from the returned documents.
    try {
      return await News.find()
                       .sort({ pubDate: -1 })
                       .limit(limit)
                       .select('-content');
    } catch (error) {    
      throw error;
    }
  }
  


module.exports = { findArticle , saveNewArticle, findLatestArticles };
