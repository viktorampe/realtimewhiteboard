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
  if (!graph.deps[project])
    console.log(
      '\x1b[31m%s\x1b[0m',
      `Given project - ${project} - not found in dependency graph`
    );
  const levelOneDependencies = graph.deps[project].map(dep => dep.projectName);
  const finalDependencies = [project];
  levelOneDependencies.forEach(levelOneDependency => {
    finalDependencies.push(levelOneDependency);
    if (!graph.deps[levelOneDependency])
      console.log(
        '\x1b[31m%s\x1b[0m',
        `Given sub dependency - ${levelOneDependency} - not found in dependency graph`
      );
    graph.deps[levelOneDependency].forEach(levelTwoDependency =>
      finalDependencies.push(levelTwoDependency.projectName)
    );
  });
  return finalDependencies.filter(function(item, i, ar) {
    return ar.indexOf(item) === i;
  });
}

function updateUsedOptionsWithDependencies(dependencies) {
  const apps = ['kabas-web', 'polpo-classroom-web', 'timeline-editor'];
  dependencies.forEach(dependency => {
    const startOfUrl = `${
      apps.indexOf(dependency) > -1 ? 'apps' : 'libs'
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
