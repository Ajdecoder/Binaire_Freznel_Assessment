interface QueueStatsProps {
  active: number;
  waiting: number;
  completed: number;
}

const QueueStats = ({
  active,
  waiting,
  completed,
}: QueueStatsProps) => {
  const stats = [
    {
      label: "Active",
      value: active,
    },
    {
      label: "Waiting",
      value: waiting,
    },
    {
      label: "Completed",
      value: completed,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <p className="text-sm text-slate-400">
            {stat.label}
          </p>

          <p className="mt-2 text-3xl font-semibold text-white">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
};

export default QueueStats;