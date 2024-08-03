const multer = require("multer");

const storage = multer.memoryStorage(); // we will save in storage
const upload = multer({storage: storage});

module.exports = upload;