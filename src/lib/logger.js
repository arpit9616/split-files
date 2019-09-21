const fs = require("fs");
const _path = require("path");
const utils = require("./utils.js");

const writeFile = (path, _param) => {
    const msg = '{"ts":"' + utils.getDateTime() + '","message":' + JSON.stringify(_param) + '}\n';

    fs.appendFile(path, msg, (err) => {
        if (err) {
            console.error("Logger error!");
            console.error(msg);
        }
    });
};

module.exports = (path) => {
    writeFile(_path.resolve(path), "********** INITIALIZING **********");
    return (_param) => writeFile(_path.resolve(path), _param);
};
