// generateCss.js: Script for generating the css files out of the scss files.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    sass = require('node-sass');

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
function generateCss(inputFilePath, outputFilePath, compressed) {
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

// style.scss --> style.css
generateCss("../scss/style.scss", "../css/style.css", false);

// style.scss --> style.min.css
generateCss("../scss/style.scss", "../css/style.min.css", true);

// foundation.scss --> foundation.css
generateCss("../scss/foundation.scss", "../css/foundation.css", false);

// foundation.scss --> foundation.min.css
generateCss("../scss/foundation.scss", "../css/foundation.min.css", true);
