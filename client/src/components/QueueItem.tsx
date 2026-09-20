import { Job } from "../types/jobs";

interface QueueItemProps {
  job: Job;
}

const QueueItem = ({ job }: QueueItemProps) => {

  const isProcessing = job.status === "processing";
  const isCompleted = job.status === "completed";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-medium text-white">
              {job.fileName}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase ${job.priority === "high"
                  ? "bg-white text-slate-950"
                  : "bg-slate-800 text-slate-300"
                }`}
            >
              {job.priority}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Job ID: {job.id}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm font-medium text-slate-200">
            {job.status === "processing"
              ? "Processing..."
              : job.status === "waiting"
                ? "Waiting for processing"
                : job.status}
          </p>

          {job.processId && (
            <p className="mt-1 text-xs text-slate-500">
              PID: {job.processId}
            </p>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-500">
              Processing
            </span>

            <span className="text-slate-300">
              {job.progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}

      {isCompleted && job.result && (
        <div className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-3">
          <p className="text-sm text-emerald-400">
            Processing completed
          </p>
        
          <p className="mt-2 text-lg font-semibold text-white">
            Total: {job.result.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Numbers processed: {job.result.numberCount}
          </p>
        </div>
      )}
    </div>
  );
};

export default QueueItem;