//the following function should be used at the time of string insertion and searching so that the consistancy will be maintained

const stringFormating = (bufferstring) => {
  // string => pushkar khadase
  //output => Pushkar Khadase
  let formatedString =
    bufferstring.charAt(0).toUpperCase() + bufferstring.slice(1);
  bufferstring = formatedString;

  for (let i = 1; i < bufferstring.length; i++) {
    if (bufferstring.charAt(i) == " ") {
      formatedString =
        bufferstring.substr(0, i) +
        " " +
        bufferstring.charAt(i + 1).toUpperCase() +
        bufferstring.substr(i + 2, bufferstring.length);
    }
  }
  return formatedString;
};

//exporting the module
exports.stringFormating = stringFormating;
