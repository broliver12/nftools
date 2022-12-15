const fs = require("fs");
const utils = require("web3-utils");

const intputFile = `input.csv`;
const outputFile = `output.csv`;
const reportFile = `report.json`;

const csv_to_json = (str, delimiter = ",") => {
  const len = str.split(delimiter).length;
  let arr = [];
  let numDuplicates = 0;
  let duplicates = [];
  let numInvalid = 0;
  let invalid = [];

  for (let i = 0; i < len; i++) {
    let cleanedAddress = str
      .split(delimiter)
      [i].replace(/\r/g, "")
      .replace(/\n/g, "");

    if (utils.isAddress(cleanedAddress)) {
      if (!arr.includes(cleanedAddress)) {
        arr.push(cleanedAddress);
      } else {
        numDuplicates++;
        duplicates.push(cleanedAddress);
      }
    } else {
      numInvalid++;
      invalid.push(cleanedAddress);
    }
  }

  let report = {
    "Number of Addrs Entered": len,
    "Number of Addrs (after clean)": len - numDuplicates - numInvalid,
    "Number of Duplicates": numDuplicates,
    Duplicates: duplicates,
    "Number of Invalid": numInvalid,
    Invalid: invalid,
  };

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  return JSON.stringify(arr);
};

(() => {
  const str = fs.readFileSync(intputFile);
  fs.writeFileSync(outputFile, csv_to_json(str.toString(), ","));
})();
