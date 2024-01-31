const mongoose = require('mongoose');
const {MONGODB_URI} = require('../config/vars'); 

// Asynchronous function to connect to the MongoDB database
async function connectToDatabase() {
  try {
    // Attempting to connect to MongoDB using the connection string (URI)
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, // Uses the new URL parser, avoiding the deprecated one
      useUnifiedTopology: true, // Uses the new engine to discover and monitor servers
      writeConcern: {
        w: "majority", // Requests acknowledgment that the write operation has propagated to the majority of nodes
        j: true // Requests acknowledgment that the write operation has been written to the journal
      }
    });
    console.log("Connected to MongoDB successfully!"); // Log success message
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Log any errors
    process.exit(1); // Exit the process with failure code
  }
}

module.exports = connectToDatabase;
