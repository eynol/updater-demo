const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

(async function main() {
  await updateBoilerplate();
  exec(
    "git tag",
    { cwd: path.resolve("./.cache/") },
    (error, output, stderr) => {
      if (error) {
        process.exit(0);
      } else {
        console.log(output);
      }
    }
  );
})();

async function updateBoilerplate() {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path.resolve("./.cache"))) {
      exec(
        "git reset --hard && git pull",
        { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            reject("");
            process.exit(1);
          } else {
            console.log(stdout);
            resolve();
          }
        }
      );
    } else {
      exec(
        "git clone https://github.com/eynol/updater-demo.git ./.cache",
        { cwd: __dirname },
        (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            reject("");
            process.exit(1);
          } else {
            console.log(stdout);
            resolve();
          }
        }
      );
    }
  });
}
