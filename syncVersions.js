const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function execPromise(command, option = {}) {
  return new Promise(function(resolve, reject) {
    exec(command, option, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

process.argv.splice(0, 2);
(async () => {
  const version = process.argv[0];
  let tags = await execPromise("git tag");
  tags = tags
    .trim()
    .split("\n")
    .join(" ");

  console.log(await execPromise("git tag -d " + tags));
  console.log(await execPromise("git pull && git fetch --tags "));
})();
