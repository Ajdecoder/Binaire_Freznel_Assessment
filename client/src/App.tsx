import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import UploadPanel from "./components/UploadPanel";
import QueueStats from "./components/QueueStats";
import QueueList from "./components/QueueList";
import { Job } from "./types/jobs";
import { api } from "./Api";

const App = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to fetch jobs");
      }

      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    const serverUrl =
      import.meta.env.VITE_SERVER_URL ||
      "http://localhost:9002";

    const wsUrl = serverUrl.startsWith("https://")
      ? serverUrl.replace("https://", "wss://")
      : serverUrl.replace("http://", "ws://");

    const socket = new WebSocket(`${wsUrl}/ws`);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "jobs:snapshot") {
        setJobs(data.jobs);
        return;
      }

      if (data.type === "job:update") {
        setJobs((previousJobs) => {
          const incomingJob = data.job;

          const existingIndex = previousJobs.findIndex(
            (job) => job.id === incomingJob.id
          );

          if (existingIndex !== -1) {
            return previousJobs.map((job) =>
              job.id === incomingJob.id
                ? incomingJob
                : job
            );
          }

          const temporaryJobIndex = previousJobs.findIndex(
            (job) =>
              job.status === "uploading" &&
              job.fileName === incomingJob.fileName
          );

          if (temporaryJobIndex !== -1) {
            return previousJobs.map((job, index) =>
              index === temporaryJobIndex
                ? incomingJob
                : job
            );
          }

          return [...previousJobs, incomingJob];
        });
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

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