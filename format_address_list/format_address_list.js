const myArgs = process.argv.slice(2);
const filename = myArgs.length > 0 ? myArgs[0] : "";
const outputFile = `output.csv`;
const reportFile = `report.json`;
const dir = `./address_list_formatter/`;
const fs = require("fs");
const utils = require("web3-utils");

const csv2json = (str, delimiter = ',') => {
    const len = str.split(delimiter).length;
    let arr = [];
    let numDuplicates = 0;
    let duplicates = [];
    let numInvalid = 0;
    let invalid = [];
    
    for (let i = 0; i<len ; i++){
      let cleanedAddress = str.split(delimiter)[i].replace(/\r/g,'').replace(/\n/g,'');

      if(utils.isAddress(cleanedAddress)){
        if(!arr.includes(cleanedAddress)) {
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
      "Number of Addrs Entered" : len,
      "Number of Addrs (after clean)" : len - numDuplicates - numInvalid,
      "Number of Duplicates" : numDuplicates,
      "Duplicates" : duplicates,
      "Number of Invalid" : numInvalid,
      "Invalid" : invalid
    }

    fs.writeFileSync(dir + reportFile, JSON.stringify(report, null, 2));
    return JSON.stringify(arr);
};

(() => {
  const str = fs.readFileSync(dir + filename);
  fs.writeFileSync(dir + outputFile, csv2json(str.toString(),','));
})();
