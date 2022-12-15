const myArgs = process.argv.slice(2);
const amt = myArgs.length > 0 ? Number(myArgs[0]) : undefined;
const url = myArgs.length > 1 ? String(myArgs[1]) : undefined;

const fs = require("fs");
const console = require("console");

const dataDir = "metadata";

const fixImageAttributes = (baseUrl) => {
    for(let i=0; i<amt; i++){
        let data = fs.readFileSync(`${dataDir}/${i}.json`);
        let json = JSON.parse(data);
        json.image = baseUrl + "/" + i + ".png";
        fs.writeFileSync(`${dataDir}/${i}.json`, JSON.stringify(json, null, 2));
    }
    console.log(`Updated image attribute in ${amt} files in /${dataDir}`);
};

(() => {
    if(url === undefined || amt === undefined || amt <= 0){
        console.log("Illegal arguments - Use: node edit_image_attribute <amt> <url>")
        console.log("<amt> must be > 0")
        process.exit(1)
    }
    fixImageAttributes(url);
})();
