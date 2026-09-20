import { useEffect, useState } from "react";

const Header = () => {
  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(
          "http://localhost:9002/api/health"
        );

        setServerConnected(response.ok);
      } catch (error) {
        setServerConnected(false);
      }
    };

    checkServer();

    const interval = setInterval(checkServer, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-xl font-semibold text-white">
            CSV Queue Manager
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Upload, queue and process your CSV files
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              serverConnected
                ? "bg-emerald-500"
                : "bg-red-500"
            }`}
          />

          <span
            className={`text-sm ${
              serverConnected
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {serverConnected
              ? "Server Connected"
              : "Server Disconnected"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;