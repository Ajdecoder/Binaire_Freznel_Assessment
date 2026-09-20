import QueueItem from "./QueueItem";
import { Job } from "../types/jobs";

interface QueueListProps {
  jobs: Job[];
}

const QueueList = ({ jobs }: QueueListProps) => {
  return (
    <div className="w-full text-xs font-mono">
      <div className="flex items-center justify-between py-2 border-b border-red-50-800 text-zinc-500 uppercase tracking-wider text-[10px]">
        <div className="flex items-center gap-2">
          <span>Queue Status</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{jobs.length} Active</span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="py-8 text-center text-zinc-500">
          <p>No active jobs uploaded upload one?.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {jobs.map((job) => (
            <QueueItem key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueList;