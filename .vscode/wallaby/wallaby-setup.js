var options = require('./wallaby-options');
var fs = require('fs');
console.log('\x1b[36m%s\x1b[0m', 'Starting Wallaby config file generation');
var selectedOption = process.argv[2];
var selectedFile = process.argv[3];
console.log(`Project option - ${selectedOption} - was chosen`);
if (selectedFile) console.log(`File - ${selectedFile}.spec.ts - was chosen`);
var usedOptions = options[selectedOption];
if (selectedFile)
  usedOptions.tests = [
    `apps/**/${selectedFile}.spec.ts`,
    `libs/**/${selectedFile}.spec.ts`
  ];
if (!usedOptions)
  console.log(
    '\x1b[31m%s\x1b[0m',
    `Provided option - ${selectedOption} - could not be found in - wallaby-options.json -.\nPlease verify that the wallabyProject options exist in the - wallaby-options.json - file`
  );
else
  fs.writeFile(
    '.vscode/wallaby/wallaby-used.json',
    JSON.stringify(usedOptions),
    function(err) {
      if (err) console.log('\x1b[31m%s\x1b[0m', err.message);
      console.log('\x1b[32m%s\x1b[0m', 'Wallaby config file generated');
    }
  );
