const { Worker } = require("worker_threads");
const path = require("path");

class WorkerManager {
  processJob(job) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve(__dirname, "../workers/csvWorker.js"),
        { workerData: { filePath: job.filePath } }
      );

      job.processId = worker.threadId;
      job.updateStatus("processing");

      worker.on("message", (result) => {
        if (result.success) {
          job.complete(result.total);
          resolve(result);
        } else {
          job.fail(result.error);
          reject(new Error(result.error));
        }
      });

      worker.on("error", (error) => {
        job.fail(error.message);
        reject(error);
      });

      worker.on("exit", (code) => {
        if (code !== 0 && job.status !== "completed") {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}

module.exports = WorkerManager;
