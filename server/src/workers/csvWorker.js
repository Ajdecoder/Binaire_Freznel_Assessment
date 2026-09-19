const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");

try {
  const csv = fs.readFileSync(workerData.filePath, "utf-8");
  let total = 0;
  let numberCount = 0;

  for (const row of csv.split(/\r?\n/).filter(Boolean)) {
    for (const value of row.split(",")) {
      const number = Number(value.trim());
      if (!Number.isNaN(number)) {
        total += number;
        numberCount++;
      }
    }
  }

  parentPort.postMessage({ success: true, total, numberCount });
} catch (error) {
  parentPort.postMessage({ success: false, error: error.message });
}
