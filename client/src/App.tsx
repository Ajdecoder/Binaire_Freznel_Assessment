import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import QueueStats from "./components/QueueStats";
import QueueList from "./components/QueueList";
import { Job } from "./types/jobs";

const App = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "http://localhost:9002/api/jobs"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      setJobs(data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };


  const startPolling = () => {
    if (intervalRef.current) return;


    fetchJobs();

    intervalRef.current = setInterval(() => {
      fetchJobs();
    }, 300);


    timeoutRef.current = setTimeout(() => {
      stopPolling();
    }, 5000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }


    fetchJobs();
  };


  useEffect(() => {
    fetchJobs();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const activeJobs = jobs.filter(
    (job) => job.status === "processing"
  ).length;

  const waitingJobs = jobs.filter(
    (job) =>
      job.status === "queued" ||
      job.status === "waiting"
  ).length;

  const completedJobs = jobs.filter(
    (job) => job.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <UploadPanel
          setJobs={setJobs}
          onUploadComplete={startPolling}
        />

        <QueueStats
          active={activeJobs}
          waiting={waitingJobs}
          completed={completedJobs}
        />

        <QueueList jobs={jobs} />
      </main>
    </div>
  );
};

export default App;