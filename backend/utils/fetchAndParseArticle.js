const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
const axios = require("axios");

// Asynchronous function to fetch and parse an article's content from a given URL
async function fetchAndParseArticle(url) {
    try {
        // Fetching the HTML content of the page
        const response = await axios.get(url);
        // Creating a DOM from the fetched HTML content
        const dom = new JSDOM(response.data);
        // Initializing the Readability parser with the created DOM
        const reader = new Readability(dom.window.document);
        // Parsing the article content using Readability
        const article = reader.parse();

        // Cleaning empty lines from the content
        const cleanedContent = article.textContent
            .split('\n') // Splitting the content into lines
            .filter(line => line.trim().length > 0) // Keeping lines that are not empty
            .join('\n'); // Joining the lines back into a single string

        return cleanedContent; // Returning the cleaned article content

    } catch (error) {
        console.error("Error fetching or parsing article:", error); // Logging any errors encountered during fetching or parsing
        return null; // Returning null in case of an error
    }
}

module.exports = fetchAndParseArticle;
