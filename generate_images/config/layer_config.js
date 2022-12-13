function Trait(name, rarity) {
  this.name = name;
  this.rarity = rarity;
}

function Layer(name, traitCount, traits) {
  this.name = name;
  this.traitCount = traitCount;
  this.traits = traits;
}

const backgroundRarities = [
  new Trait("black", 25),
  new Trait("gray", 25),
  new Trait("green", 25),
  new Trait("metallic", 25),
];

const skinRarities = [
  new Trait("black", 25),
  new Trait("blue", 25),
  new Trait("purple", 25),
  new Trait("gold", 25),
];

const layers = [
  new Layer("background", 4, backgroundRarities),
  new Layer("skin", 4, skinRarities),
];

// Returns JSON Metadata with an empty image attribute
const getMetadataJson = (edition, attributes) => {
  return {
    description: "",
    image: "",
    name: "",
    attributes: attributes,
  };
};

const isLayerTypeTrait = (layerName, elementName) => {
  return true;
};

const modifyLayerName = (directoryName) => {
  // Modify dir name
  return directoryName;
};

const modifyElementName = (directoryName, elementName) => {
  // Modify file name
  return elementName;
};

const signImage = async (ctx, currentEditionIndex, currentEditionId, currentEditionAttributes) => {
  // ctx.fillStyle = "#b7b7b7";
  // ctx.font = "Regular 60pt Microsoft Sans Serif";
  // ctx.textBaseline = "center";
  // ctx.textAlign = "center";
  // ctx.fillText(`#${currentEditionId}`, 1300, 1580);
};

// Output count if none is specified when running the program
const defaultOutputCount = 1;

// Dimensions of Generated Images
const outputImageSize = {
  width: 2048,
  height: 2048,
};

module.exports = {
  defaultOutputCount,
  outputImageSize,
  layers,
  getMetadataJson,
  modifyLayerName,
  modifyElementName,
  signImage
};
