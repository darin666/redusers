const fs = require('fs');

var appendData = () => {
    try {
        var data = JSON.stringify(req.body);
        var separator = ",\n";
        data += separator;
    } catch (error) {
        console.error(error);
    };

    fs.appendFile('data.txt', data, (err) => {
        if (err) throw err;
        console.log('Data were appended to a file.');
    });

};

module.exports.appendData = appendData;