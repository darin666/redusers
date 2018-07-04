const fs = require('fs');

const appendData = (dataObject) => {
    var dataString = JSON.stringify(dataObject);
    var separator = ",\n";
    dataString += separator;

    fs.appendFile('data.txt', dataString, 'utf8', (err) => {
        if (err) throw err;
    });
};

module.exports.appendData = appendData;