//import filesync for interacting with file system
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { isLayerTypeTrait, idMapOutputFile, traitPercentOutputFile, traitOccurenceOutputFile, fixTraitType, saveDir, buildDir, dataDir, imgDir, outputDir, layersDir, layersOrder, format, getDescription, defaultEdition} = require("./config.js");
const myArgs = process.argv.slice(2);
const ed = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition;
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;

const Exists = new Map();
let idArray;
let metadata = [];
let attributes = [];
let hash = [];
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Filesystem setup
const buildSetup = () => {
  // Clear image directory
  if (fs.existsSync(imgDir)) {
    fs.rmdirSync(imgDir, { recursive: true });
  }
  fs.mkdirSync(imgDir);
  // Clear metadata directory
  if (fs.existsSync(dataDir)) {
    fs.rmdirSync(dataDir, { recursive: true });
  }
  fs.mkdirSync(dataDir);
};

//uses defined constants and inline declaration to create a map of all layer files
const getLayers = () => {
  const layers = layersOrder().map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number,
    rarities: layerObj.rarities
  }));
  return layers;
};

//gets all files in a directory
const getElements = path => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: i,
        fileName: i
      };
    });
};

const selectElement = (rarities) => {
    const rand = Math.random() * 100;
    var curMax = 0;
    for (let i = 0; i < rarities.length; i++) {
        curMax = curMax + rarities[i];
        if(curMax > rand) {
            return i;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Helper that returns a shuffled array
const shuffle = array => {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const signImage = async (_sig) => {
    ctx.fillStyle = "#b7b7b7";
    ctx.font = "Regular 60pt Microsoft Sans Serif";
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText(_sig, 1300, 1580);
};

const addZero = (n) => {
    if(n<10) return "000" + n;
    else if(n>=10 && n<100) return "00" + n;
    else if(n>=100 && n<1000) return "0" + n;
    else return n;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Add metadata to each PNG file
const addMetadata = async (_edition) => {
  let openSeaFormatMetadata = getDescription(_edition, attributes);

  try {
    fs.statSync(`${dataDir}/${_edition}.json`)
  } catch(err){
    if(err == null || err.code === 'ENOENT') {
        fs.writeFileSync(`${dataDir}/${_edition}.json`, JSON.stringify(openSeaFormatMetadata, null, 2));
    } else {
        console.log('Oh no, error: ', err.code);
    }
  }

  attributes = [];
  hash = [];
};

//draw a single layer
//call saveLayer to save the layer to the file
const drawLayer = async (_layer, _edition, element) => {
  if (element) {
    //add attributes
    hash.push(_layer.id);
    hash.push(element.id);
    if(isLayerTypeTrait(_layer.name, element.name.replace(".png",""))){
       attributes.push({
         trait_type: fixTraitType(_layer.name),
         value: element.name.replace(".png","")
       });
    }
    //load, draw, save
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    // signImage(`#${addZero(idArray[_edition])}`)
    fs.writeFileSync(`${imgDir}/${_edition}.png`, canvas.toBuffer("image/png"));
  }
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//main call point for file creation
const createFiles = async edition => {

  idArray = shuffle(Array.from({length: edition}, (_, i) => i + 1))
  let numDupes = 0;
  let map = new Map();
  let editionMap = new Map();
  const rarityMap = [];

  for (let i = 0; i < edition; i++) {
     await getLayers().forEach(async (layer) => {
         //use random number to randomly select a layer option
         let rand = Math.random();
         let sel = selectElement(layer.rarities)
         let element = layer.elements[sel];


         // Uncommenting this makes the program run if your rarities dont the amount of files
         // in the specific layer directory, but hides crashes that signify problems in rarity mapping.
         // Use at own risk.
         // while(element == undefined) {
         //   sel = selectElement(layer.rarities)
         //   element = layer.elements[sel];
         // }

         if(false){
           // Don't draw layer
         } else {
           // Applies any custom logic needed when groupinf the traits for analysis
           let prefix = fixTraitType(layer.name);
           let name = prefix + " : " + element.name
             if( map.has(name) ) {
               editionMap.set(name, map.get(name) + 1);
             } else {
               editionMap.set(name, 1);
               map.set(name, 1);
             }
             await drawLayer(layer, i, element);
         }
     });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let key = hash.toString();
    if (Exists.has(key)) {
        console.log(
           `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
             key
           )}`
         );
         numDupes++;
         if (numDupes > edition) break;
         i--;
    } else {
         Exists.set(key, i);
         editionMap.forEach((item, i) => {
           map.set(i, item);
         });
         addMetadata(i);
         console.log("Creating edition " + i);
         // console.log(editionMap);
         editionMap.clear();
        }
    }

    let traitPercents = new Map();
    let traitOccurences = new Map([...map.entries()].sort());
    traitOccurences.forEach((item, i) => {
        traitPercents.set(i, item * 100 / edition)
    });
    fs.writeFileSync(idMapOutputFile, JSON.stringify(idArray, null, 2));
    fs.writeFileSync(traitPercentOutputFile, JSON.stringify(Object.fromEntries(traitPercents), null, 2));
    fs.writeFileSync(traitOccurenceOutputFile, JSON.stringify(Object.fromEntries(traitOccurences), null, 2));
    console.log(traitOccurences);
    console.log(traitPercents);
    console.log("Program Complete.");
};

(async () => {
  await buildSetup();
  await createFiles(ed);
  fs.cpSync(buildDir, saveDir, {recursive: true});
})();

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
