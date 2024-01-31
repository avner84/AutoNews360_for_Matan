const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const { getArticles, getArticleById } = require("../controllers/news");

// Define a route for fetching the latest articles.
// This route allows any user to access the list of titles for the latest articles.
router.get("/latest-articles", getArticles);

// Define a route for fetching a specific article by its ID.
// This route requires the user to be authenticated, as indicated by the isAuth middleware.
// Only authenticated users can access the details of a specific article.
router.get("/article", isAuth, getArticleById);

module.exports = router;
