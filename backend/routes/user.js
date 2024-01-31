const express = require("express");
const router = express.Router();

const { changePassword, deleteUser, userEdit } = require("../controllers/user");

const {
  changePasswordValidations,
  editUserValidations,
} = require("../validations/user");

const {handleValidationErrors} = require("../validations/errorHandling");

const isAuth = require("../middleware/is-auth");

// Define a PATCH route for changing a user's password. This route requires user authentication.
// It applies validation checks for the password change request and handles any validation errors.
router.patch(
  "/change-password",
  isAuth, // Define a PATCH route for changing a user's password. This route requires user authentication.
  // It applies validation checks for the password change request and handles any validation errors.
  [changePasswordValidations,  handleValidationErrors], // Apply validations and handle errors
  changePassword // Controller function to change the password
);

// Define a DELETE route for deleting a user account. This route also requires user authentication
router.delete("/delete-user", isAuth, deleteUser); 

// Define a PATCH route for editing user details. Similar to the change-password route, this requires authentication,
// applies validation checks for editing user details, and handles any errors that might occur during validation
router.patch(
  "/edit-user",
  isAuth,
  [editUserValidations,
  handleValidationErrors],
  userEdit
);

module.exports = router;
