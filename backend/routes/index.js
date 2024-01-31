const express = require('express');
const router = express.Router();

const newsRoutes = require("./news");
const authRoutes = require("./auth");
const userRoutes = require("./user");

// This means any request to '/auth' will be handled by the authRoutes router,
// requests to '/news' will be handled by the newsRoutes router,
// and requests to '/user' will be directed to the userRoutes router.
router.use("/auth", authRoutes);
router.use("/news", newsRoutes);
router.use("/user", userRoutes);

module.exports = router;
