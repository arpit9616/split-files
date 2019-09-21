global.conf = require("./conf/conf.json");

const logger = require("./src/lib/logger.js");
global.LOG = {
    info: logger(conf.infoLogPath),
    error: logger(conf.errorLogPath)
};

const { walk, seperate, formatIndex } = require("./src/main");

walk(conf.targetDIR, (error, files) => {
    if (error) return LOG.error(error);

    const numberOfFiles = files.length;
    LOG.info(`${numberOfFiles} file(s) found.`);
    
    const fill = numberOfFiles.toString().length;
    files.forEach((filePath, index) =>
        seperate(filePath)
            .then((subs) => LOG.info({ fileNumber: formatIndex(index, fill), filePath, subs }))
            .catch((error) => LOG.error({ fileNumber: formatIndex(index, fill), filepath, error }))
    );
});
