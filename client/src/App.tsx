import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import QueueStats from "./components/QueueStats";
import QueueList from "./components/QueueList";
import { Job } from "./types/jobs";
import { useState } from "react";


const App = () => {

  const initialJobs: Job[] = [
    {
      id: "job-1024",
      fileName: "sales-data.csv",
      priority: "high",
      status: "waiting",
      progress: 100,
      processId: "8421",
    },

  ]

  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <UploadPanel setJobs={setJobs} />

        <QueueStats
          active={jobs.filter((job) => job.status === "processing").length}
          waiting={jobs.filter((job) => job.status === "waiting").length}
          completed={jobs.filter((job) => job.status === "completed").length}
        />

        <QueueList jobs={jobs} />
      </main>
    </div>
  );
};

export default App;