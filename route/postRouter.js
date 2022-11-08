const express = require("express");
const { body } = require("express-validator");
const {
  addPost,
  semuaPost,
  editPost,
  hapusPost,
  findByJudulDanCategory,
} = require("../controller/postController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const router = express.Router();
router.get("/semuapost", semuaPost);
router.get("/cari", findByJudulDanCategory);
router.post(
  "/tambahpost",
  authMiddleware,
  upload,
  body("judul").notEmpty(),
  body("isi").notEmpty(),
  body("categoryId").notEmpty(),
  addPost
);
router.patch(
  "/editpost/:id",
  authMiddleware,
  upload,
  body("judul").notEmpty(),
  body("isi").notEmpty(),
  body("categoryId").notEmpty(),
  editPost
);
router.delete("/hapuspost/:id", authMiddleware, hapusPost);
module.exports = router;
