const Job = require("../classes/Job");

module.exports = ({ queueController }) => {
  return (req, res) => {
    try {
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "At least one CSV file is required",
        });
      }

      
      let { priorities } = req.body;

      
      if (typeof priorities === "string") {
        try {
          priorities = JSON.parse(priorities);
        } catch (error) {
          return res.status(400).json({
            message: "Priorities must be a valid array",
          });
        }
      }

      
      if (!Array.isArray(priorities)) {
        priorities = [priorities];
      }

      
      if (priorities.length !== req.files.length) {
        return res.status(400).json({
          message: "Number of priorities must match number of files",
        });
      }

      
      const invalidPriority = priorities.find(
        (priority) => !["high", "low"].includes(priority)
      );

      if (invalidPriority) {
        return res.status(400).json({
          message: "Each priority must be high or low",
        });
      }

      
      const jobs = req.files.map((file, index) => {
        const priority = priorities[index];

        const job = new Job({
          id: `job-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
          fileName: file.originalname,
          filePath: file.path,
          priority,
        });

        job.updateStatus("uploaded");

        return job;
      });

      
      res.status(201).json({
        message: "Files uploaded successfully",
        jobs,
      });

      
      setImmediate(() => {
        jobs.forEach((job) => {
          queueController.addJob(job);
        });
      });
    } catch (error) {
      console.error("Upload error:", error);

      
      return res.status(500).json({
        message: "Failed to upload files",
      });
    }
  };
};