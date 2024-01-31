const User = require("../models/user");

// Function to find a user by their ID
const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw error;
  }
};

// Function to find a single user based on a query
const findUser = async (query) => {
  try {
    return await User.findOne(query);
  } catch (error) {
    throw error;
  }
};

// Function to create a new user with given user data
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to update a user by their ID with the provided user data
const updateUser = async (userId, userData) => {
  try {
    // Update and return the new user data. { new: true } ensures the updated document is returned
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to update a user's active status to true
const updateUserActiveStatus = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      return null;
    }

    user.isActive = true;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUserById,
  findUser,
  createUser,
  updateUser,
  updateUserActiveStatus,
};
