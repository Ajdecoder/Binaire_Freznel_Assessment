const Job = require("../classes/Job");

module.exports = ({ queueController }) => {
  return (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "CSV file is required",
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

      job.updateStatus("uploaded");

      res.status(201).json({
        message: "File uploaded successfully",
        job,
      });

      setImmediate(() => {
        queueController.addJob(job);
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to upload file",
      });
    }
  };
};