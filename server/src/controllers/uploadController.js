const Job = require("../classes/Job");

const uploadController = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV file is required" });

  const { priority } = req.body;
  if (!["high", "low"].includes(priority)) {
    return res.status(400).json({ message: "Priority must be high or low" });
  }

  const job = new Job({
    id: `job-${Date.now()}`,
    fileName: req.file.originalname,
    filePath: req.file.path,
    priority,
  });

  res.status(201).json({ message: "File uploaded successfully", job });
};

module.exports = uploadController;
