//import filesync for interacting with file system
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { saveData } = require("./config.js");
const myArgs = process.argv.slice(2);
const end = myArgs.length > 0 ? Number(myArgs[0]) : undefined;
const url = myArgs.length > 1 ? String(myArgs[1]) : undefined;

const fixImageAttributes = (baseUrl) => {
    for(let i=0; i<end; i++){
        let data = fs.readFileSync(`${saveData}/${i}.json`);
        let json = JSON.parse(data);
        json.image = baseUrl + "/" + i + ".png";
        fs.writeFileSync(`${saveData}/${i}.json`, JSON.stringify(json, null, 2));
    }
    console.log("Successfully updated image strings to [[ " + baseUrl + " ]]");
};

(() => {
    if(url === undefined || end === undefined || end <= 0){
      exit(1, 'Enter a URL - should end in /');
    }
    fixImageAttributes(url);
})();
