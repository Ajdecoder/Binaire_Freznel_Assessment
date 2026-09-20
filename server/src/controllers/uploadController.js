const Job = require("../classes/Job");

module.exports = ({ queueController }) => {
  return (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "CSV file is required",
        });
      }

      if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
        return res.status(400).json({
          message: "Only CSV files are allowed",
        });
      }

      const { priority } = req.body;

      if (!["high", "low"].includes(priority)) {
        return res.status(400).json({
          message: "Priority must be high or low",
        });
      }

      const job = new Job({
        id: `job-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        fileName: req.file.originalname,
        filePath: req.file.path,
        priority,
      });

      queueController.addJob(job);

      return res.status(201).json({
        message: "File uploaded successfully",
        job,
      });
    } catch (error) {
      console.error("Upload controller error:", error);

      return res.status(500).json({
        message: "Failed to create job",
      });
    }
  };
};