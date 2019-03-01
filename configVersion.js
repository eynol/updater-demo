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


  console.log(`执行以下命令:  
  git add .boilerplate.json                 # 添加修改              
  git commit -m "[Auto] Override version"   # commit 提交
  git tag ${version}                        # 打上新标签
  git push                                  # 推送代码改动
  git push --tags                           # 推送所有的tags
  
  `)
  try{
    await execPromise(`git add .boilerplate.json && git commit -m "[Auto] Override version" `)
  }catch(e){
    // 如果本地的 boilerplate.json 的版本已经是需要打上标签的版本，上一句可能会执行出错
  }
  console.log(await execPromise(`git tag ${version} && git push && git push --tags`));
  
  console.log(await execPromise("cat ./.boilerplate.json"));
})();
