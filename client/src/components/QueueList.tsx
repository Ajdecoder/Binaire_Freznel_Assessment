import QueueItem from "./QueueItem";
import { Job } from "../types/jobs";

interface QueueListProps {
  jobs: Job[];
}

const QueueList = ({ jobs }: QueueListProps) => {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Queue Status
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Monitor all uploaded files in real time.
          </p>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
          {jobs.length} jobs
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900 px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No jobs in the queue
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Upload a CSV file to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <QueueItem key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default QueueList;