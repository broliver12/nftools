//import filesync for interacting with file system
const fs = require("fs");

const myArgs = process.argv.slice(2);
const end = myArgs.length > 0 ? Number(myArgs[0]) : undefined;

const saveDir = "images"
const extToRemove = "-crunch"
const fileExt = "png"

(() => {
    if(end === undefined){
      console.log("Illegal arguments - Use: node renameFromCrunch <end>")
      process.exit(1)
    }
    if(end <= 0) {
      console.log("End must be > 0")
      process.exit(1)
    }
    for (var i = start; i < end; i++ ) {
      try {
        fs.renameSync(`${saveDir}/${i}${extToRemove}.${fileExt}`,`${saveDir}/${i}.${fileExt}` );
      } catch(exception) {
        console.log(exception)
      }
    }
})();
