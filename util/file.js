//importing the file system to deal with the system files and delete them
const fs = require("fs");

//function for deleting the files
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};

//exporting the file so that it can be accsible
exports.deleteFile = deleteFile;