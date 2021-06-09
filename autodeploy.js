let Client = require('ssh2-sftp-client');
const shell = require('shelljs');
let client = new Client();

async function uploadFile(project,onError) {

   try{
       await client.connect({
           host: project.host,
           port: project.port,
           username: project.username,
           password: project.password
       }, true);

       // await client.chmod(project.remoteFolder, 0o644);
       try{
           await client.rmdir(`${project.remoteFolder}/${project.build}`, true);
       }catch(error){
           console.log(error,111)
       }
       client.on('upload', info => {
           console.log(`Listener: Uploaded ${info.source}`);
       });
       const results = await client.uploadDir(`${project.localFolder}/${project.build}`, `${project.remoteFolder}/${project.build}`);
       client.end();
       return results;
   }catch(error){
       client.end();
       onError()
   }

}

async function deploy(path) {
    return new Promise((resolve, reject) =>{
        shell.cd(path);
        shell.exec('npm run build build:staging', (code, stdout, stderr) => {
            resolve(code);
            // shell.exit(code);
        })
    })
}

module.exports = {uploadFile, deploy}
