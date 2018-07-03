const fs = require('fs');

var appendData = (req) => {
    try {
        var data = JSON.stringify(req);
        var separator = ",\n";
        data += separator;
    } catch (err) {
        throw err;
    };

    fs.appendFile('data.txt', data, 'utf8', (err) => {
        if (err) throw err;
    });
};

module.exports.appendData = appendData;