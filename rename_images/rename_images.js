const myArgs = process.argv.slice(2);
const amt = myArgs.length > 0 ? Number(myArgs[0]) : undefined;

const fs = require("fs");

const saveDir = "images";
const extToRemove = "-crunch";
const fileExt = "png";

(() => {
  if (amt === undefined || amt <= 0) {
    console.log("Illegal arguments - Use: node rename_images <amt>");
    console.log("<amt> must be > 0");
    process.exit(1);
  }

  for (var i = 0; i < amt; i++) {
    try {
      fs.renameSync(
        `${saveDir}/${i}${extToRemove}.${fileExt}`,
        `${saveDir}/${i}.${fileExt}`
      );
    } catch (exception) {
      console.log(exception);
    }
  }

  console.log(`Renamed ${amt} images in /${saveDir}`);
  process.exit(1);
})();
