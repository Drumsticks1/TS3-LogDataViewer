// generateCss.js: Script for generating the css files out of the scss files.
// Author: Drumsticks
// GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

// This script is designed to be executed from the scripts folder

var fs = require("fs"),
  sass = require("node-sass");

// Generate css directory if not already existing.
if (!fs.existsSync("../css")) {
  fs.mkdirSync("../css");
}

/**
 * Generates all css files out of the scss files in the input directory.
 *
 * @param {string} inputDirectory - the path of the directory containing the scss files.
 * @param {string} outputDirectory - the path of the directory the css files are written to.
 */
function generateCss(inputDirectory, outputDirectory) {
  var inputFiles = fs.readdirSync(inputDirectory);

  console.log("Processing scss files...");
  for (var i = 0; i < inputFiles.length; i++) {
    (function (i) {
      sass.render({
        file: inputDirectory + "/" + inputFiles[i],
        outputStyle: "nested"
      }, function (error, result) {
        if (!error)
          fs.writeFileSync(outputDirectory + "/" + inputFiles[i].slice(0, -4) + "css", result.css);
        else
          console.log(error.message);
      })
    }(i));
  }
  console.log("Finished processing scss files.");
}

generateCss("../scss/", "../css/");
