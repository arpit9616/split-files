const fs = require("fs");
const path = require("path");

const textract = require("textract");

const walk = (dir, done) => {
    let results = [];

    fs.readdir(dir, (error, list) => {
        if (error) return done(error, undefined);

        let pending = list.length;
        if (!pending) return done(undefined, results);

        list.forEach((file) => {
            file = path.resolve(dir, file);
            fs.stat(file, (error, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(file, (error, _results) => {
                        results = results.concat(_results);
                        if (!--pending) done(undefined, results);
                    });
                } else {
                    if (!conf.extension)
                        results.push(file);
                    else if (file.endsWith(conf.extension))
                        results.push(file);

                    if (!--pending) done(undefined, results);
                }
            });
        });
    });
};

const seperate = (filePath) => {
    return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, { preserveLineBreaks: false }, async (error, text) => {
            if (error) { return reject(error); }

            const contents = text.split(conf.separator);

            const statusList = contents.map((content, index) => writeFile(content, filePath, index));
            await Promise.all(statusList);

            return resolve(contents.length);
        });
    });
};

const writeFile = (content, filePath, index) => {
    return new Promise((resolve, reject) => {
        const modifiedPath = filePath.substr(0, filePath.lastIndexOf("/") + 1) + "SF_" + filePath.substring(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf(conf.extension)) + ".PROCESSED." + formatIndex(index) + ".txt";

        fs.writeFile(modifiedPath, content, (error) => {
            if (error) {
                LOG.error({ filePath: modifiedPath, error });
                return resolve(false);
            }
            return resolve(true);
        });
    });
};

const formatIndex = (index = 0, fill = 4) => {
    index = (index + 1).toString();
    while (index.length != fill) {
        index = "0" + index;
    }
    return index;
};

module.exports = { walk, seperate, formatIndex };
