class QueueManager {
  constructor() {
    this.highPriorityQueue = [];
    this.lowPriorityQueue = [];
    this.jobs = new Map();
  }

  add(job) {
    this.jobs.set(job.id, job);

    if (job.priority === "high") {
      this.highPriorityQueue.push(job);
    } else {
      this.lowPriorityQueue.push(job);
    }
  }

  getNextJob() {
    if (this.highPriorityQueue.length > 0) {
      return this.highPriorityQueue.shift();
    }

    if (this.lowPriorityQueue.length > 0) {
      return this.lowPriorityQueue.shift();
    }

    return null;
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  getAllJobs() {
    return Array.from(this.jobs.values());
  }

  getQueueStatus() {
    return {
      high: this.highPriorityQueue.map((job) => ({
        id: job.id,
        fileName: job.fileName,
      })),

      low: this.lowPriorityQueue.map((job) => ({
        id: job.id,
        fileName: job.fileName,
      })),
    };
  }
}

module.exports = QueueManager;