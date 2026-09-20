const {
  parentPort,
  workerData,
} = require("worker_threads");

const fs = require("fs");

const sleep = (ms) => {
  Atomics.wait(
    new Int32Array(new SharedArrayBuffer(4)),
    0,
    0,
    ms
  );
};

try {
  const csv = fs.readFileSync(
    workerData.filePath,
    "utf-8"
  );

  const rows = csv
    .split(/\r?\n/)
    .filter((row) => row.trim() !== "");

  let total = 0;
  let numberCount = 0;

  const totalRows = rows.length;

  for (let i = 0; i < totalRows; i++) {
    const values = rows[i].split(",");

    for (const value of values) {
      const number = Number(value.trim());

      if (!Number.isNaN(number)) {
        total += number;
        numberCount++;
      }
    }

    const progress = Math.round(
      ((i + 1) / totalRows) * 100
    );

    parentPort.postMessage({
      type: "progress",
      progress,
    });

    sleep(700);
  }

  parentPort.postMessage({
    type: "completed",
    total,
    numberCount,
  });
} catch (error) {
  parentPort.postMessage({
    type: "error",
    error:
      error instanceof Error
        ? error.message
        : String(error),
  });
}