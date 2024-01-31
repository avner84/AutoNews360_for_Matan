const express = require("express");
const router = express.Router();

// Import authentication controller functions
const {
  signup,
  verify,
  requestResendVerification,
  updateVerification,
  login,
  loginByToken
} = require("../controllers/auth");

// Import validation middlewares for signup and login
const {
  signupValidations,  
  loginValidations 
} = require("../validations/auth");

// Import a middleware to handle validation errors
const {handleValidationErrors} = require("../validations/errorHandling");

// Import a middleware to check if the user is authenticated
const isAuth = require("../middleware/is-auth");

// Define a route for user signup with validation checks
router.put("/signup", [signupValidations, handleValidationErrors], signup);

// Define a route to verify a user's email
router.get("/verify", verify);

// Define a route to resend the verification email
router.get("/resend-verification", requestResendVerification);

// Define a route for requesting a new verification token via email.
// This is used in scenarios where the user needs a new verification token,
// possibly due to the original token expiring.
// The logic to locate the user and the content of the email differ from the initial verification process.
router.get("/update-verification", updateVerification);

// Define a route for user login with validation checks
router.post("/login", [loginValidations, handleValidationErrors], login);

// Define a route for user login with a token , using the isAuth middleware
router.post("/login-by-token", isAuth, loginByToken);


module.exports=router;
