//dimensions of each layer to overlay
const format = {
    width: 2048,
    height: 2048
};

const layersOrder = () => {
  return [
    { name: "background", number: 12, rarities: [3.5,13,1,23,13.5,1,3.5,13.5,1,13.5,3.5,10]},
    { name: "skin", number: 12, rarities: [3.5,14,1.25,0.06,1,14,3,14,1,13.5,34.54,0.15] },
    { name: "spots", number: 9, rarities: [33,10.5,33.5,3.5,0.4,3.6,3.8,0.5,11.2]},
    { name: "tattoo", number: 3, rarities: [1.3,94,4.7]},
    { name: "clothes", number: 14, rarities: [3.5,0.1,3.5,10.5,1,10.25,1.1,3.4,45.24,10,1,10.25,0.06,0.1]},
    { name: "belt", number: 6, rarities: [5.5,11,0.5,11,3.5,68.5]},
    { name: "legendary_hands", number: 3, rarities: [0.1,0.2,99.7]},
    { name: "eyes", number: 9, rarities: [10.64,0.12,3.36,5.56,5.65,58.41,3.38,12.85,0.03]},
    { name: "horns", number: 5, rarities: [4.4,0.1,4.5,90.5,0.5] },
    { name: "jewelry", number: 5, rarities: [0.11,0.09,91.34,4.04,4.42]},
    { name: "mouth", number: 10, rarities: [10.5,0.12,2.25,1.09,36,1,10.2,20.5,12.65]},
    { name: "piercing", number: 5, rarities: [0.7,3.5,59.2,15.3,21.3]},
    { name: "board", number: 1, rarities: [100]}
  ]
}

const getDescription = (edition, attributes) => {
    return {
        description: "",
        image: "",
        name: "",
        attributes: attributes
    };
}

const isLayerTypeTrait = (layerName, elementName) => {
    return true;
}

const fixTraitType = prefix => {
    return prefix;
}

//Directories
const dir = `./art_generator/`;
const buildDir = dir + `build`;
const dataDir = dir + `build/metadata`;
const imgDir = dir + `build/img`;
const layersDir = dir + `traits`;

const saveDir = `./build_save`;
const saveData = saveDir + `/metadata`;


const outputDir = dir + `build/output`;
const idMapOutputFile = `${outputDir}/idMap.json`;
const traitPercentOutputFile = `${outputDir}/traitPercents.json`;
const traitOccurenceOutputFile = `${outputDir}/traitOccurences.json`;

//necessary exports
//DO NOT REMOVE THIS LINE
const defaultEdition = 1;
module.exports = { isLayerTypeTrait, idMapOutputFile, traitPercentOutputFile, traitOccurenceOutputFile, fixTraitType, saveData, saveDir, buildDir, dataDir, imgDir, outputDir, layersDir, layersOrder, format, defaultEdition, getDescription };
