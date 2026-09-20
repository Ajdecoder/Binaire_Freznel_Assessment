class QueueController {
  constructor(queueManager, workerManager) {
    this.queueManager = queueManager;
    this.workerManager = workerManager;

    this.currentJob = null;
  }

  addJob(job) {
    this.queueManager.add(job);

    if (this.currentJob) {
      job.updateStatus("waiting");
    } else {
      job.updateStatus("queued");
    }

    this.processNext();
  }

  async processNext() {
    if (this.currentJob) {
      return;
    }

    const job = this.queueManager.getNextJob();

    if (!job) {
      return;
    }

    this.currentJob = job;

    job.updateStatus("processing");
    job.updateProgress(0);

    try {
      await this.workerManager.processJob(
        job,
        (progress) => {
          job.updateProgress(progress);
        }
      );

    } catch (error) {
      console.error(
        `[QUEUE] Failed: ${job.fileName}`,
        error
      );

      job.fail(error.message);
    } finally {
      this.currentJob = null;

      setImmediate(() => {
        this.processNext();
      });
    }
  }
}

module.exports = QueueController;