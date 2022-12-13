// Path from project root
const pathFromNodeRoot = `.`;

// Trait Input
const configDirectory = `${pathFromNodeRoot}/config`
const traitDirectory = `${configDirectory}/traits`;

// Image & Metadata Output
const outputDirectory = `${pathFromNodeRoot}/output`;
const metadataOutputDirectory = `${outputDirectory}/metadata`;
const imageOutputDirectory = `${outputDirectory}/images`;

// Backup
const backupDirectory = `${pathFromNodeRoot}/backup`;

// Report Output
const reportOutputDirectory = `${outputDirectory}/report`;
const idMapOutputFile = `${reportOutputDirectory}/idMap.json`;
const traitPercentOutputFile = `${reportOutputDirectory}/traitPercents.json`;
const traitOccurenceOutputFile = `${reportOutputDirectory}/traitOccurences.json`;
  
module.exports = {
    traitDirectory,
    outputDirectory,
    backupDirectory,
    metadataOutputDirectory,
    imageOutputDirectory,
    idMapOutputFile,
    traitPercentOutputFile,
    traitOccurenceOutputFile,
};