const myArgs = process.argv.slice(2);
const outputCount = myArgs.length > 0 ? Number(myArgs[0]) : defaultOutputCount;

const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");

const {
  traitDirectory,
  outputDirectory,
  backupDirectory,
  metadataOutputDirectory,
  imageOutputDirectory,
  idMapOutputFile,
  traitPercentOutputFile,
  traitOccurenceOutputFile,
} = require("./config/directory_config.js");

const {
  defaultOutputCount,
  outputImageSize,
  layers,
  getMetadataJson,
  modifyLayerName,
  modifyElementName,
  signImage
} = require("./config/layer_config.js");

const {
  isEmptyElementFile,
  shouldSkipMetadataForEmptyFiles,
  applyCustomLogic
} = require("./config/logic_config.js");

let idArray;
const createdHashesToId = new Map();
const collectionTraitToUsageCount = new Map();
const canvas = createCanvas(outputImageSize.width, outputImageSize.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

const buildSetup = () => {
  // Clear image directory
  if (fs.existsSync(imageOutputDirectory)) {
    fs.rmSync(imageOutputDirectory, { recursive: true });
  }
  fs.mkdirSync(imageOutputDirectory);
  // Clear metadata directory
  if (fs.existsSync(metadataOutputDirectory)) {
    fs.rmSync(metadataOutputDirectory, { recursive: true });
  }
  fs.mkdirSync(metadataOutputDirectory);
};

// Map trait data from `config.js`, add
const getLayers = () => {
  return layers.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${traitDirectory}/${layerObj.name}/`,
    elements: getFilesInDirectory(`${traitDirectory}/${layerObj.name}/`),
    number: layerObj.number,
    traits: layerObj.traits,
  }));
};

const getFilesInDirectory = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: i,
        fileName: i,
      };
    });
};

const chooseRandomTrait = (traits) => {
  const rand = Math.random() * 100;
  var curMax = 0;
  for (let i = 0; i < traits.length; i++) {
    curMax = curMax + traits[i].rarity;
    if (curMax > rand) {
      return traits[i];
    }
  }
};

//Helper that returns a shuffled array
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// Add metadata for a single file
const addMetadata = async (currentEditionIndex, currentEditionId, attributes) => {
  let openSeaFormatMetadata = getMetadataJson(currentEditionId, attributes);

  try {
    fs.statSync(`${metadataOutputDirectory}/${currentEditionIndex}.json`);
  } catch (err) {
    if (err === null || err.code === "ENOENT") {
      console.log("Creating metadata file " + currentEditionIndex + ".json");
      fs.writeFileSync(
        `${metadataOutputDirectory}/${currentEditionIndex}.json`,
        JSON.stringify(openSeaFormatMetadata, null, 2)
      );
    } else {
      console.log("Error: Could not create metadata file - ", err.code);
    }
  }
};

// Draw a single layer
const drawLayer = async (layer, edition, element) => {
  //add attributes
  //load, draw, save
  const image = await loadImage(`${layer.location}${element.fileName}`);
  ctx.drawImage(image, 0, 0, outputImageSize.width, outputImageSize.height);
  fs.writeFileSync(
    `${imageOutputDirectory}/${edition}.png`,
    canvas.toBuffer("image/png")
  );
};

//main call point for file creation
const createFiles = async (collectionSupply) => {
  let currentEditionHash = [];
  let currentEditionAttributes = [];

  idArray = shuffle(Array.from({ length: collectionSupply }, (_, i) => i + 1));
  let numberOfDuplicates = 0;
  let editionTraitToUsageCount = new Map();

  for (
    let currentEditionIndex = 0;
    currentEditionIndex < collectionSupply;
    currentEditionIndex++
  ) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentEditionAttributes = [];
    currentEditionHash = [];

    await getLayers().forEach(async (layer) => {
      let selectedTrait = chooseRandomTrait(layer.traits);
      let selectedElement = layer.elements.filter((item) => {
        return item.name.replace(".png", "") === selectedTrait.name;
      })[0];

      // This function should handle and exclusions or interactions between specific elements
      // For example, if background1 looks bad with item16 specifically, you'd handle that logic in `applyCustomLogic`
      selectedElement = applyCustomLogic(layer, selectedElement, currentEditionIndex);

      if (isEmptyElementFile(selectedElement) && shouldSkipMetadataForEmptyFiles()) {
        // Don't draw layer
      } else {
        // Applies any custom logic needed when grouping the traits for analysis
        let fixedLayerName = modifyLayerName(layer.name);
        let fixedElementName = modifyElementName(layer.name, selectedElement.name).replace(".png", "")
        let name = fixedLayerName + " : " + fixedElementName;
        if (collectionTraitToUsageCount.has(name)) {
          editionTraitToUsageCount.set(name, collectionTraitToUsageCount.get(name) + 1);
        } else {
          editionTraitToUsageCount.set(name, 1);
          collectionTraitToUsageCount.set(name, 1);
        }

        currentEditionHash.push(layer.id);
        currentEditionHash.push(selectedElement.id);
        currentEditionAttributes.push({
          trait_type: fixedLayerName,
          value: fixedElementName,
        });

        if (!isEmptyElementFile(selectedElement)) {
          await drawLayer(layer, currentEditionIndex, selectedElement);
        }
      }
    });

    let hashString = currentEditionHash.toString();
    if (createdHashesToId.has(hashString)) {
      console.log(
        `Duplicate creation for edition ${currentEditionIndex}. Same as edition ${createdHashesToId.get(
          hashString
        )}`
      );
      numberOfDuplicates++;
      if (numberOfDuplicates > collectionSupply) break;
      currentEditionIndex--;
    } else {
      createdHashesToId.set(hashString, currentEditionIndex);
      editionTraitToUsageCount.forEach((item, index) => {
        collectionTraitToUsageCount.set(index, item);
      });
      signImage(ctx, currentEditionIndex, idArray[currentEditionIndex], currentEditionAttributes)
      addMetadata(currentEditionIndex, idArray[currentEditionIndex], currentEditionAttributes);
      editionTraitToUsageCount.clear();
    }
  }
};

const writeReport = async () => {
  let traitPercents = new Map();
  let traitOccurences = new Map([...collectionTraitToUsageCount.entries()].sort());
  traitOccurences.forEach((item, i) => {
    traitPercents.set(i, (item * 100) / outputCount);
  });
  fs.writeFileSync(idMapOutputFile, JSON.stringify(idArray, null, 2));
  fs.writeFileSync(
    traitPercentOutputFile,
    JSON.stringify(Object.fromEntries(traitPercents), null, 2)
  );
  fs.writeFileSync(
    traitOccurenceOutputFile,
    JSON.stringify(Object.fromEntries(traitOccurences), null, 2)
  );
};

////////////////////////// Main //////////////////////////
(async () => {
  buildSetup();
  await createFiles(outputCount);
  await writeReport();

  // Overwrite backup directory once program completes successfully
  console.log("Writing Backup...");
  fs.cpSync(outputDirectory, backupDirectory, { recursive: true });
  console.log("Program Complete");
})();
//////////////////////////////////////////////////////////
