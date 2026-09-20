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
      </div>
    </header>
  );
};

export default Header;