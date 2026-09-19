class QueueManager {
  constructor() {
    this.highPriorityQueue = [];
    this.lowPriorityQueue = [];
  }

  add(job) {
    if (job.priority === "high") this.highPriorityQueue.push(job);
    else this.lowPriorityQueue.push(job);
  }

  getNextJob() {
    if (this.highPriorityQueue.length) return this.highPriorityQueue.shift();
    if (this.lowPriorityQueue.length) return this.lowPriorityQueue.shift();
    return null;
  }

  getAllJobs() {
    return [...this.highPriorityQueue, ...this.lowPriorityQueue];
  }

  isEmpty() {
    return !this.highPriorityQueue.length && !this.lowPriorityQueue.length;
  }
}

module.exports = QueueManager;
