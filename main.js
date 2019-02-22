const fs = require("fs");
const path = require("path");
const utils = require("./utils.js");
const { execPromise } = utils;

const CLI_DIR = __dirname;
const PROJ_DIR = process.cwd();
const CACHE_DIR = path.resolve(__dirname, "./.cache");
const currentVersion = require(path.resolve(PROJ_DIR, ".boilerplate.json"))
  .version;
process.argv.splice(0, 2);
const updateToVersion = process.argv[0];

(async function main() {
  await updateBoilerplate();
  let tags = await getTags();

  let pIndex = tags.indexOf(currentVersion);
  let tIndex = tags.indexOf(updateToVersion);
  console.log(currentVersion, updateToVersion);
  console.log(pIndex, tIndex);

  for (let i = pIndex; i <= tIndex; i++) {
    let version = tags[i];
    await update(version);
  }
})();

async function updateBoilerplate() {
  if (fs.existsSync(CACHE_DIR)) {
    let result = await execPromise(
      "git reset --hard -q && git checkout master && git pull origin master",
      {
        cwd: CACHE_DIR
      }
    );
    console.log(result);
  } else {
    let result = await execPromise(
      "git clone https://github.com/eynol/updater-demo.git ./.cache",
      { cwd: CLI_DIR }
    );
    console.log(result);
  }
}

async function getTags() {
  let output = await execPromise("git tag", { cwd: CACHE_DIR });
  if (output.length) {
    let tags = output.trim().split("\n");
    return utils.sortGitTags(tags);
  }
}

async function update(version) {
  let result = await execPromise(`git checkout ${version} && git ls-files`, {
    cwd: CACHE_DIR
  });

  // do update 
  console.log("-----------");
  console.log(result);
}
