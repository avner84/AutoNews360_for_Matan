const User = require("../models/user");

// Function to find a user by their ID
const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {   
    throw error;
  }
};

// Function to update a user's password
const updateUserPassword = async (user, newPassword) => {
  try {
    user.password = newPassword;
    await user.save();
    return user;
  } catch (error) {    
    throw error;
  }
};

// Function to delete a user by their ID
const deleteUserById = async (userId) => {
  try {
    return await User.findByIdAndDelete(userId);
  } catch (error) {    
    throw error;
  }
};

// Function to update various details of a user
const updateUserDetails = async (user, updateFields) => {
  try {
    user = {...user.toObject(), ...updateFields};
    await user.save();
    return user;
  } catch (error) {
    // Handle or log the error as needed
    throw error;
  }
};

module.exports = { findUserById, updateUserPassword, deleteUserById, updateUserDetails };

