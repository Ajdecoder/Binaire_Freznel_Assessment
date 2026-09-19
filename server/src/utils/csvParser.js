const parseCSVNumbers = (csv) => {
  const numbers = [];

  for (const row of csv.split(/\r?\n/).filter(Boolean)) {
    for (const value of row.split(",")) {
      const number = Number(value.trim());
      if (!Number.isNaN(number)) numbers.push(number);
    }
  }

  return numbers;
};

module.exports = { parseCSVNumbers };
