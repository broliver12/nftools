const myArgs = process.argv.slice(2);
const amt = myArgs.length > 1 ? Number(myArgs[0]) : undefined;
const url = myArgs.length > 2 ? String(myArgs[1]) : undefined;

const fs = require("fs");

const outputDirectory = "output";
const data = {
  "image": `${url}`
};

(() => {
    if(start === undefined || amt === undefined || url === undefined){
      console.log("Illegal arguments - Use: node_create_mock_metadata <amt> <url>")
      console.log("<amt> must be > 0")
      process.exit(1)
    }

    try {
      fs.writeFileSync(`${outputDirectory}/0.json`, JSON.stringify(data, null, 2));
    } catch(exception) {
      console.log(exception)
      if (exception.toString().includes('ENOENT')) {
        fs.mkdirSync(outputDirectory)
      }
    }

    for (var i = 0; i < amt; i++ ) {
      fs.writeFileSync(`${outputDirectory}/${i}.json`, JSON.stringify(data, null, 2));
    }
    console.log(`Created ${amt} files in /output`)
    process.exit(0)
})();
