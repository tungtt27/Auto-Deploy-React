const { execSync } = require('child_process');

module.exports = async (path) => {
    return new Promise((resolve, reject) => {
        execSync('npm run build:staging', {
            cwd: path,
        });
        resolve();
    })
};
