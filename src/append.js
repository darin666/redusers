const fs = require('fs');

const appendData = (dataObject) => {
    const separator = ",\n";
    const dataString = JSON.stringify(dataObject) + separator;

    fs.appendFile('data.txt', dataString, 'utf8', (err) => {
        if (err) throw err;
    });
};

module.exports.appendData = appendData;