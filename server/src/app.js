const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/uploadRoutes");

const QueueManager = require("./classes/QueueManager");
const WorkerManager = require("./classes/WorkerManager");
const QueueController = require("./classes/QueueController");

const app = express();

app.use(cors());
app.use(express.json());

const queueManager = new QueueManager();
const workerManager = new WorkerManager();

const notifyJobUpdate = (job) => {
  const broadcastJobUpdate = app.get("broadcastJobUpdate");

  if (broadcastJobUpdate) {
    broadcastJobUpdate(job);
  }
};

const queueController = new QueueController(
  queueManager,
  workerManager,
  notifyJobUpdate
);

app.set("queueManager", queueManager);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use(
  "/api/jobs",
  uploadRoutes({
    queueManager,
    queueController,
  })
);

app.get("/api/jobs", (req, res) => {
  res.json({
    jobs: queueManager.getAllJobs(),
    queue: queueManager.getQueueStatus(),
  });
});

module.exports = app;