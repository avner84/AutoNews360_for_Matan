const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const connectToDatabase = require('./utils/connect');
const {port: PORT} = require('./config/default');
const { manageNewsArticleProcessing } = require("./services/articleManagement");

const routes = require('./routes/index');

const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`Received ${method} request to ${url}`);
  next();
});

app.use(bodyParser.json());

// Configure CORS with an options object
app.use(cors({
  origin: '*', // Allows requests from any origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specifies the allowed request methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specifies the allowed headers
  credentials: true // Allows the use of credentials like cookies
}));



// Error Handling Middleware: Handles any errors that occur in the application
app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode = 500, message, data } = error;
  res.status(statusCode).json({ message, data });
});


app.listen(PORT || 8080, async () => {
  await connectToDatabase(); // Attempt to connect to the database
  app.use(routes);
  console.log(`Server is running on port ${PORT || 8080}`);
  // The main function that manages fetching articles, filtering them, creating video clips, saving the videos to S3, and storing the articles in the database
  // manageNewsArticleProcessing();
});



