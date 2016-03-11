// generateCss.js: Script for generating the css files out of the scss files.
// Author: Drumsticks1
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    sass = require("node-sass");

// Generate css directory if not already existing.
if (!fs.existsSync("../css")) {
    fs.mkdirSync("../css");
}

/**
 * Generates a css file out of the input file.
 * @param {string} inputFilePath - the path of the input file.
 * @param {string} outputFilePath - the path of the output file.
 * @param {Boolean} compressed - true if the output file should be compressed.
 */
function processScssFile(inputFilePath, outputFilePath, compressed) {
    var outputStyle = "nested";
    if (compressed)
        outputStyle = "compressed";

    sass.render({
        file: inputFilePath,
        outputStyle: outputStyle
    }, function(error, result) {
        if (!error) {
            fs.writeFileSync(outputFilePath, result.css);
        } else {
            console.log("An error occurred while generating the css files out of the scss files:");
            console.log(error.message);
        }
    });
}

/**
 * Generates all css files out of the scss files in the input directory.
 *
 * @param {string} inputDirectory - the path of the directory containing the scss files.
 * @param {string} outputDirectory - the path of the directory the css files are written to.
 */
function generateCss(inputDirectory, outputDirectory) {
    var scssFiles = fs.readdirSync(inputDirectory);

    console.log("Processing scss files...");
    for (var i = 0; i < scssFiles.length; i++) {
        var inputPath = inputDirectory + "/" + scssFiles[i],
            outputPathWithoutEnding = outputDirectory + "/" + scssFiles[i].substring(0, scssFiles[i].indexOf(".scss"));

        processScssFile(inputPath, outputPathWithoutEnding + ".css", false);
        processScssFile(inputPath, outputPathWithoutEnding + ".min.css", true);
    }
}

generateCss("../scss/", "../css/");
