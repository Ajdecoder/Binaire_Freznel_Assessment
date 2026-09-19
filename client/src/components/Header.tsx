const Header = () => {
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

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-xs font-medium text-emerald-400">
            Server Online
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;