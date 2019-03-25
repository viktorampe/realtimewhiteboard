var options = require('./wallaby-options');
var fs = require('fs');

console.log('Starting Wallaby config file generation');
var selectedOption = process.argv[process.argv.length - 1];
console.log(`Project options - ${selectedOption} - was chosen`);
var usedOptions = options[selectedOption];
if (!usedOptions)
  console.log(
    `Provided option - ${selectedOption} - could not be found in - wallaby-options.json -`
  );
else
  fs.writeFile(
    '.vscode/wallaby/wallaby-used.json',
    JSON.stringify(usedOptions),
    function(err) {
      if (err) console.log(err);
      console.log('Wallaby config file generated');
    }
  );
