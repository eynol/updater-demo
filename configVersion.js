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
  console.log(`
请在所有新版本的改动提交之后，运行： 
  $ node configVersion.js 2.3.3 
将会为自动打上 2.3.3 版本的tag 
`)
  if (!version) {
    console.log('无版本号，退出')
    process.exit(1);
  }

  let verseionTester = /^\d+\.\d+\.\d+$/;
  if (!verseionTester.test(version)) {
    console.log("版本不正确");
    process.exit(1);
  }

  let config = {};
  if (fs.existsSync("./.boilerplate.json")) {
    let content = fs.readFileSync("./.boilerplate.json");
    config = JSON.parse(content);
  }

  try {
    console.log(await execPromise("git push origin :" + version));
  } catch (e) {
    //console.log(e.message);
  }
  try {
    console.log(await execPromise("git tag -d " + version));
  } catch (e) {
    //console.log(e.message);
  }

  config.version = version;
  fs.writeFileSync("./.boilerplate.json", JSON.stringify(config, null, 2));

  console.log(await execPromise(`git add .boilerplate.json && git commit -m "[Auto] Override version" && git tag ${version} && git push -t`));
  
  console.log(await execPromise("cat ./.boilerplate.json"));
})();