const { Worker } = require("worker_threads");
const path = require("path");

class WorkerManager {
  async processJob(job, onProgress) {
    return new Promise((resolve, reject) => {
      const workerPath = path.resolve(
        __dirname,
        "../workers/csvWorker.js"
      );

      const worker = new Worker(workerPath, {
        workerData: {
          filePath: job.filePath,
        },
      });
      
      const workerId = worker.threadId;

      job.workerThreadId = workerId;

      worker.on("message", (message) => {

        if (message.type === "progress") {
          onProgress(message.progress);
          return;
        }

        if (message.type === "completed") {
          job.complete({
            total: message.total,
            numberCount: message.numberCount,
          });

          resolve(message);
          return;
        }

        if (message.type === "error") {
          const errorMessage =
            typeof message.error === "string"
              ? message.error
              : message.error?.message ||
                "Unknown worker error";

          console.error(
            "[WORKER PROCESSING ERROR]",
            errorMessage
          );

          reject(new Error(errorMessage));
        }
      });

      worker.on("error", (error) => {
        console.error(
          "[WORKER THREAD ERROR]",
          error.message
        );

        reject(error);
      });

      worker.on("exit", (code) => {

        if (code !== 0 && job.status !== "completed") {
          reject(
            new Error(
              `Worker exited with code ${code}`
            )
          );
        }
      });
    });
  }
}

module.exports = WorkerManager;