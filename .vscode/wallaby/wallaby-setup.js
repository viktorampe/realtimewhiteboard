var options = require('./wallaby-options');
var fs = require('fs');
console.log('Starting Wallaby config file generation');
var selectedOption = process.argv[2];
var selectedFile = process.argv[3];
console.log(`Project options - ${selectedOption} - was chosen`);
if (selectedFile) console.log(`File - ${selectedFile}.spec.ts - was chosen`);
var usedOptions = options[selectedOption];
if (selectedFile)
  usedOptions.tests = [
    `apps/**/${selectedFile}.spec.ts`,
    `libs/**/${selectedFile}.spec.ts`
  ];
if (!usedOptions)
  throw Error(
    `Provided option - ${selectedOption} - could not be found in - wallaby-options.json -`
  );
else
  fs.writeFile(
    '.vscode/wallaby/wallaby-used.json',
    JSON.stringify(usedOptions),
    function(err) {
      if (err) throw err;
      console.log('Wallaby config file generated');
    }
  );
