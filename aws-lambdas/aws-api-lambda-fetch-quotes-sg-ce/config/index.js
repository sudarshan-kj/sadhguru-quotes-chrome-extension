const os = require("os");
const path = require("path");

module.exports = {
  LOCAL_CACHE_FILE_NAME: `${os.tmpdir()}${path.sep}quotesLocalFile.json`,
};
