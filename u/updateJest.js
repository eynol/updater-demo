const fs = require('fs');
const path = require('path');

process.argv.splice(0, 2);

let packageJSON = fs.readFileSync(process.argv[0]).toJSON();

Object.assign(packageJSON.jest, {
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tools/assetsTransformer.js",
    "\\.(css|less)$": "<rootDir>/tools/assetsTransformer.js",
    "\\.(pdf|xml)$": "<rootDir>/tools/assetsTransformer.js"
  },
  "testURL": "http://localhost:5000",
  "setupFiles": [
    "<rootDir>/source/__mock__/rAF.js",
    "<rootDir>/source/__mock__/localStorage.js"
  ]
})


fs.writeFileSync(process.argv[0], JSON.stringify(packageJSON, null, 2));