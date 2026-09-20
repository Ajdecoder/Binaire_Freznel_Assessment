class QueueController {
    constructor(
        queueManager,
        workerManager,
        notifyJobUpdate
    ) {
        this.queueManager = queueManager;
        this.workerManager = workerManager;
        this.notifyJobUpdate = notifyJobUpdate;

        this.isProcessing = false;
        this.executionCounter = 0;
    }

    addJob(job) {
        this.queueManager.add(job);

        if (this.isProcessing) {
            job.updateStatus("waiting");

            this.notifyJobUpdate(job);

            return;
        }

        job.updateStatus("queued");

        this.notifyJobUpdate(job);

        setTimeout(() => {
            this.processNext();
        }, 2000);
    }

    async processNext() {
        if (this.isProcessing) return;

        const job = this.queueManager.getNextJob();

        if (!job) return;

        this.isProcessing = true;

        await new Promise((resolve) =>
            setTimeout(resolve, 1500)
        );

        // Actual execution starts here
        this.executionCounter++;

        job.executionOrder = this.executionCounter;

        job.updateStatus("processing");
        job.updateProgress(0);

        this.notifyJobUpdate(job);

        try {
            await this.workerManager.processJob(
                job,
                (progress) => {
                    job.updateProgress(progress);

                    this.notifyJobUpdate(job);
                }
            );

            this.notifyJobUpdate(job);
        } catch (error) {
            job.fail(error.message);

            this.notifyJobUpdate(job);
        } finally {
            this.isProcessing = false;

            setImmediate(() => {
                this.processNext();
            });
        }
    }
}

module.exports = QueueController;