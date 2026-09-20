const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

module.exports = ({ queueManager, queueController }) => {
  router.post(
    "/upload",
    upload.single("file"),
    uploadController({
      queueManager,
      queueController,
    })
  );

  return router;
};