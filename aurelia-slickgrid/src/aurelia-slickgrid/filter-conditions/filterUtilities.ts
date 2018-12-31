/**
 * Compare 2 objects,
 * we will loop through all properties of the object to compare the entire content of both objects
 * Optionally we can compare by a property key, when that is provided we will compare the object content
 * @param o1
 * @param o2
 * @param compareKey optional
 */
export const compareObjects = (o1: any, o2: any, compareKey?: string) => {
  // if user provided an object compare key then compare directly both objects by that key
  if (compareKey && (o1.hasOwnProperty(compareKey) || o2.hasOwnProperty(compareKey))) {
    return o1[compareKey] === o2 || o1 === o2[compareKey] || o1[compareKey] === o2[compareKey];
  }

  // loop through all object properties to compare the full content of the object
  for (const p in o1) {
    if (o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  for (const p in o2) {
    if (o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  return true;
};

export const testFilterCondition = (operator: string, value1: any, value2: any): boolean => {
  switch (operator) {
    case '<':
    case 'LT': return (value1 < value2);
    case '<=':
    case 'LE': return (value1 <= value2);
    case '>':
    case 'GT': return (value1 > value2);
    case '>=':
    case 'GE': return (value1 >= value2);
    case '!=':
    case '<>':
    case 'NE': return (value1 !== value2);
    case '=':
    case '==':
    case 'EQ': return (value1 === value2);
    case 'IN': return ((value2 && value2.indexOf) ? (value2.indexOf(value1) > -1) : false);
    case 'NIN':
    case 'NOT_IN':
      return ((value2 && value2.includes) ? (!value2.includes(value1)) : false);
    case 'IN_CONTAINS':
      if (value2 && Array.isArray(value2) && value2.findIndex) {
        return ((value2.findIndex((val) => value1.indexOf(val) > -1)) > -1);
      }
      return false;
    case 'NIN_CONTAINS':
    case 'NOT_IN_CONTAINS':
      if (value2 && Array.isArray(value2) && value2.findIndex) {
        return !((value2.findIndex((val) => value1.indexOf(val) > -1)) > -1);
      }
      return false;
  }
  return true;
};
