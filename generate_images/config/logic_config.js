
// Name of empty file in directory
const emptyFileName = "none.png"

const isEmptyElementFile = (file) => {
    return file.fileName === emptyFileName;
}

const shouldSkipMetadataForEmptyFiles = () => {
    return true;
}

const applyCustomLogic = (layer, selectedElement, currentEditionIndex) => {
    return selectedElement;
}

module.exports = {
    isEmptyElementFile,
    shouldSkipMetadataForEmptyFiles,
    applyCustomLogic
};
  