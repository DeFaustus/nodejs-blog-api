const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const postRouter = require("./postRouter");
router.use("/auth", userRouter);
router.use("/post", postRouter);
module.exports = router;
