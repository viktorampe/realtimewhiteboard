const options = require('./wallaby-options');
const fs = require('fs');
const exec = require('child_process').exec;

console.log('\x1b[36m%s\x1b[0m', 'Starting Wallaby config file generation');
const { usedOptions, selectedOption } = retrieveOptionsBase();
console.log('Building dependency graph');
exec(
  'npm run dep-graph -- --file=./.vscode/wallaby/graph.json',
  (err, stdout, stderr) => {
    if (err) {
      console.log('\x1b[31m%s\x1b[0m', err.message);
      return;
    }
    console.log(stdout);
    const dependencies = getDependencies(selectedOption);
    console.log(`The following test dependencies were found: ${dependencies}`);
    updateUsedOptionsWithDependencies(dependencies);
    createWallabyUsedJson();
  }
);

function retrieveOptionsBase() {
  const selectedOption = process.argv[2];
  const selectedFile = process.argv[3];
  console.log(`Project option - ${selectedOption} - was chosen`);
  if (selectedFile) console.log(`File - ${selectedFile}.spec.ts - was chosen`);
  const usedOptions = {
    files: [
      'tsconfig.json',
      'wallaby-test-setup.ts',
      'jest.config.js',
      '!apps/**/*.spec.ts',
      '!libs/**/*.spec.ts'
    ],
    tests: []
  };
  if (selectedFile)
    usedOptions.tests = [
      `apps/**/${selectedFile}.spec.ts`,
      `libs/**/${selectedFile}.spec.ts`
    ];
  return { usedOptions, selectedOption };
}

function getDependencies(project) {
  const graph = require('./graph');
  const levelOneDependencies = graph.deps[project].map(dep => dep.projectName);
  const finalDependencies = [project];
  levelOneDependencies.forEach(levelOneDependency => {
    finalDependencies.push(levelOneDependency);
    graph.deps[levelOneDependency].forEach(levelTwoDependency =>
      finalDependencies.push(levelTwoDependency.projectName)
    );
  });
  return finalDependencies.filter(function(item, i, ar) {
    return ar.indexOf(item) === i;
  });
}

function updateUsedOptionsWithDependencies(dependencies) {
  dependencies.forEach(dependency => {
    const startOfUrl = `${
      dependency.includes('app') ? 'apps' : 'libs'
    }/${dependency
      .replace('pages-settings-', 'pages/settings/')
      .replace('pages-', 'pages/')}`;
    usedOptions.files.push(
      `${startOfUrl}/**/*.+(ts|html|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)`
    );
    if (!usedOptions.tests.length) {
      usedOptions.tests.push(`${startOfUrl}/**/*.spec.ts`);
    }
  });
}

function createWallabyUsedJson() {
  fs.writeFile(
    '.vscode/wallaby/wallaby-used.json',
    JSON.stringify(usedOptions),
    function(err) {
      if (err) {
        console.log('\x1b[31m%s\x1b[0m', err.message);
        return;
      }
      console.log('\x1b[32m%s\x1b[0m', 'Wallaby config file generated');
    }
  );
}
