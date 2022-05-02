//import filesync for interacting with file system
const fs = require("fs");
const { saveData } = require("./config.js");
const myArgs = process.argv.slice(2);
const start = myArgs.length > 0 ? Number(myArgs[0]) : undefined;
const end = myArgs.length > 1 ? Number(myArgs[1]) : undefined;
const url = myArgs.length > 2 ? String(myArgs[2]) : undefined;

const data = {
  "image": `${url}`
};

(() => {
    if(start === undefined || end === undefined || url === undefined){
      console.log("Illegal arguments - Use: npm run batch <start> <end> <url>")
      process.exit(1)
    }
    if(start <0 || end <= start) {
      console.log("Start must be >= 0, end must be > start.")
      process.exit(1)
    }
    for (var i = start; i < end; i++ ) {
      fs.writeFileSync(`${saveData}/${i}.json`, JSON.stringify(data, null, 2));
    }
})();
