const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function readData(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  // Finish the new file before replacing the previous bookings.
  const temporaryPath = filePath + "." + process.pid + ".tmp";
  fs.writeFileSync(temporaryPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  fs.renameSync(temporaryPath, filePath);
}

module.exports = { readData, writeData };
