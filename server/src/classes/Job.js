class Job {
  constructor({ id, fileName, filePath, priority }) {
    this.id = id;
    this.fileName = fileName;
    this.filePath = filePath;
    this.priority = priority;
    this.status = "uploaded";
    this.progress = 0;
    this.processId = null;
    this.result = null;
    this.error = null;
  }

  updateStatus(status) { this.status = status; }
  updateProgress(progress) { this.progress = progress; }
  complete(result) {
    this.status = "completed";
    this.progress = 100;
    this.result = result;
  }
  fail(error) {
    this.status = "failed";
    this.error = error;
  }
}

module.exports = Job;
