declare interface StringConstructor {
  allTitleCase(inputStr: string): string;
  format(inputStr: string, ...args: any[]): string;
  trim(inputStr: string): string;
  titleCase(inputStr: string): string;
}

String.format = (format: string, ...args): string => {
  // const args = (Array.isArray(arguments[1])) ? arguments[1] : Array.prototype.slice.call(arguments, 1);

  return format.replace(/{(\d+)}/g, (match, number) => {
    return (typeof args[number] !== 'undefined') ? args[number] : match;
  });
};

/**
 * Trim any extra white space from the string
 * @param string inputStr
 * @returns string outputStr
 */
String.trim = (inputStr: string): string => {
  return inputStr ? inputStr.replace(/\s+/g, ' ') : inputStr;
};

/**
 * Title case the complete sentence (upper case first char of each word while changing everything else to lower case)
 * @param string inputStr
 * @returns string outputStr
 */
String.allTitleCase = (inputStr: string): string => {
  return inputStr.replace(/\w\S*/g, (outputStr) => {
    return outputStr.charAt(0).toUpperCase() + outputStr.substr(1).toLowerCase();
  });
};

/**
 * Title case the complete sentence (upper case first char of each word while changing everything else to lower case)
 * @param string inputStr
 * @returns string outputStr
 */
String.titleCase = (inputStr: string): string => {
  return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
};
