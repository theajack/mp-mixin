
const fs = require('fs');

function syncVersion () {
    const version = require('../package.json').version;
    const pkg = require('../npm/package.json');
    pkg.version = version;
    fs.writeFile('./npm/package.json', JSON.stringify(pkg, null, 4), 'utf8', (err) => {
        if (err) throw err;
    });
}

syncVersion();