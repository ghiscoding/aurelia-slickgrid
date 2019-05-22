import {
  addWhiteSpaces,
  charArraysEqual,
  decimalFormatted,
  disposeAllSubscriptions,
  findOrDefault,
  formatNumber,
  getDescendantProperty,
  htmlDecode,
  htmlEncode,
  htmlEntityDecode,
  htmlEntityEncode,
  parseBoolean,
  parseUtcDate,
  sanitizeHtmlToText,
  titleCase,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  uniqueArray,
  uniqueObjectArray,
} from '../utilities';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';

describe('Service/Utilies', () => {
  describe('addWhiteSpaces method', () => {
    it('should return the an empty string when argument provided is lower or equal to 0', () => {
      expect(addWhiteSpaces(-2)).toBe('');
      expect(addWhiteSpaces(0)).toBe('');
    });

    it('should return the a simple string with x spaces only where x is the number of spaces provided as argument', () => {
      expect(addWhiteSpaces(5)).toBe('     ');
    });
  });

  // skip it for now since there is no DOMParser in node, this might work later when using Jest with JSDOM instead of node type
  xdescribe('htmlDecode method', () => {
    it('should return a decoded HTML string', () => {
      const result = htmlDecode(`&lt;div class=&quot;color: blue&quot;&gt;Something&lt;/div&gt;`);
      expect(result).toBe(`<div class="color: blue">Something</div>`);
    });

    it('should return a decoded HTML string with single quotes encoded as well', () => {
      const result = htmlDecode(`&lt;div class=&#39;color: blue&#39;&gt;Something&lt;/div&gt;`);
      expect(result).toBe(`<div class='color: blue'>Something</div>`);
    });
  });

  describe('htmlEncode method', () => {
    it('should return a encoded HTML string', () => {
      const result = htmlEncode(`<div class="color: blue">Something</div>`);
      expect(result).toBe(`&lt;div class=&quot;color: blue&quot;&gt;Something&lt;/div&gt;`);
    });

    it('should return a encoded HTML string with single quotes encoded as well', () => {
      const result = htmlEncode(`<div class='color: blue'>Something</div>`);
      expect(result).toBe(`&lt;div class=&#39;color: blue&#39;&gt;Something&lt;/div&gt;`);
    });
  });

  describe('htmlEntityDecode method', () => {
    it('should be able to decode HTML entity of an HTML string', () => {
      const result = htmlEntityDecode(`&#60;&#100;&#105;&#118;&#62;&#97;&#60;&#47;&#100;&#105;&#118;&#62;`);
      expect(result).toBe(`<div>a</div>`);
    });

    it('should be able to decode unicode characters and also latin accents', () => {
      const result = htmlEntityDecode(`&#83;&#97;&#109;&#39;&#115;&#32;&#55357;&#56960;&#55358;&#56708;&#32;&#101;&#115;&#112;&#97;&#241;&#111;&#108;`);
      expect(result).toBe(`Sam's 🚀🦄 español`);
    });
  });

  describe('htmlEntityEncode method', () => {
    it('should be able to encode HTML entity of an HTML string', () => {
      const result = htmlEntityEncode(`<div>a</div>`);
      expect(result).toBe(`&#60;&#100;&#105;&#118;&#62;&#97;&#60;&#47;&#100;&#105;&#118;&#62;`);
    });

    it('should be able to encode unicode characters and also latin accents', () => {
      const result = htmlEntityEncode(`Sam's 🚀🦄 español`);
      expect(result).toBe(`&#83;&#97;&#109;&#39;&#115;&#32;&#55357;&#56960;&#55358;&#56708;&#32;&#101;&#115;&#112;&#97;&#241;&#111;&#108;`);
    });
  });

  describe('arraysEqual method', () => {
    it('should return false when at least 1 input is not an array', () => {
      const array1 = null;
      const array2 = [];
      const isEqual = charArraysEqual(array1, array2);
      expect(isEqual).toBe(false);
    });

    it('should compare 2 empty arrays and return true', () => {
      const array1 = [];
      const array2 = [];
      const isEqual = charArraysEqual(array1, array2);
      expect(isEqual).toBe(true);
    });

    it('should compare 2 arrays of chars with different length and return false', () => {
      const array1 = ['a', 'b'];
      const array2 = ['a', 'b', 'c'];
      const isEqual = charArraysEqual(array1, array2);
      expect(isEqual).toBe(false);
    });

    it('should compare 2 arrays of chars with same content in different order and return true', () => {
      const array1 = ['a', 'b', 'c'];
      const array2 = ['a', 'c', 'b'];
      const isEqual = charArraysEqual(array1, array2);
      expect(isEqual).toBe(true);
    });

    it('should compare 2 arrays of chars with same content in different order and return true', () => {
      const array1 = ['a', 'b', 'c'];
      const array2 = ['a', 'c', 'b'];
      const array3 = ['a', 'b', 'c'];

      expect(charArraysEqual(array1, array2, true)).toBe(false);
      expect(charArraysEqual(array1, array3, true)).toBe(true);
    });

    it('should not work when comparing 2 arrays of objects and return false', () => {
      const array1 = [{ id: 1, name: 'a', order: 3 }, { id: 2, name: 'def', order: 45 }];
      const array2 = [{ id: 1, name: 'a', order: 3 }, { id: 2, name: 'def', order: 45 }];
      const isEqual = charArraysEqual(array1, array2);
      expect(isEqual).toBe(false);
    });
  });

  describe('disposeAllSubscriptions method', () => {
    it('should return original array when array of subscriptions is empty', () => {
      const output = disposeAllSubscriptions([]);
      expect(output).toEqual([]);
    });

    it('should return unique values when input array has duplicate objects', () => {
      const subscriptions: Subscription[] = [];
      const ea1 = new EventAggregator();
      const ea2 = new EventAggregator();
      subscriptions.push(ea1.subscribe('test', () => { }), ea2.subscribe('test', () => { }));
      const output = disposeAllSubscriptions(subscriptions);
      expect(output).toHaveLength(0);
    });
  });

  describe('findOrDefault method', () => {
    it('should find an element in the array given a provided logic to find such element', () => {
      const collection = ['a', 'c', 'b', 1];
      const searchValue = 'c';
      const output = findOrDefault(collection, (val) => val === searchValue);
      expect(output).toBe(searchValue);
    });

    it('should find an object in an array of objects given a provided logic to find such element', () => {
      const collection = [{ id: 1, name: 'a', order: 3 }, { id: 2, name: 'def', order: 45 }, { id: 3, name: 'xyz', order: 99 }];
      const searchProperty = 'id';
      const searchId = 2;

      const output = findOrDefault(collection, (item) => {
        if (item && item.hasOwnProperty(searchProperty)) {
          return item[searchProperty] === searchId;
        }
        return false;
      });

      expect(output).toEqual({ id: 2, name: 'def', order: 45 });
    });

    it('should return default value when element is not found in the array', () => {
      const collection = ['a', 'c', 'b', 1];
      const searchValue = 'z';
      const defaultValue = 'a';
      const output = findOrDefault(collection, ((val) => val === searchValue), defaultValue);
      expect(output).toBe(defaultValue);
    });
  });

  describe('decimalFormatted method', () => {
    it('should return original input when the argument is not a number', () => {
      const input = 'abc';
      const output = decimalFormatted(input, 2, 2);
      expect(output).toBe(input);
    });

    it('should return a string with a number formatted with 2 decimals when only a number is provided', () => {
      const input = 123;
      const output = decimalFormatted(input);
      expect(output).toBe('123.00');
    });

    it('should return a string with a number formatted with 2 decimals when the number provided is a string', () => {
      const input = '456';
      const output = decimalFormatted(input);
      expect(output).toBe('456.00');
    });

    it('should return a string without any decimals when the minDecimal is set to 0 and the provided is an integer', () => {
      const input = '456';
      const output = decimalFormatted(input, 0);
      expect(output).toBe('456');
    });

    it('should return a string with a number formatted and rounded to 4 decimals when maxDecimal is set to 4 and the number provided has extra decimals', () => {
      const input = 456.4567899;
      const output = decimalFormatted(input, 0, 4);
      expect(output).toBe('456.4568');
    });

    it('should return a string with a number formatted to 2 decimals minDecimal is set to 2 and maxDecimal is set to any number greater than 2', () => {
      const input = 456.4;
      const output = decimalFormatted(input, 2, 4);
      expect(output).toBe('456.40');
    });

    it('should return a string with a negative number formatted to 2 decimals minDecimal is set to 2', () => {
      const input = -456.4;
      const output = decimalFormatted(input, 2, 4);
      expect(output).toBe('-456.40');
    });
  });

  describe('formatNumber method', () => {
    it('should return original value when input provided is not a number', () => {
      const input = 'abc';
      const output = formatNumber(input);
      expect(output).toBe(input);
    });

    it('should return a string with a number formatted to 2 decimals when minDecimal is set to 2', () => {
      const input = 123;
      const output = formatNumber(input, 2);
      expect(output).toBe('123.00');
    });

    it('should return a string with a number formatted and rounded to 4 decimals when maxDecimal is set to 4 and the number provided has extra decimals', () => {
      const input = 456.4567899;
      const output = formatNumber(input, 0, 4);
      expect(output).toBe('456.4568');
    });

    it('should return a string without decimals when these arguments are null or undefined and the input provided is an integer', () => {
      const input = 456;
      const output1 = formatNumber(input);
      const output2 = formatNumber(input, null, null);
      const output3 = formatNumber(input, undefined, undefined);

      expect(output1).toBe('456');
      expect(output2).toBe('456');
      expect(output3).toBe('456');
    });

    it('should return a formatted string wrapped in parentheses when the input number is negative and the displayNegativeNumberWithParentheses argument is enabled', () => {
      const input = -123;
      const displayNegativeNumberWithParentheses = true;
      const output = formatNumber(input, 2, 2, displayNegativeNumberWithParentheses);
      expect(output).toBe('(123.00)');
    });

    it('should return a formatted currency string when the input number is negative and symbol prefix is provided', () => {
      const input = -123;
      const displayNegativeNumberWithParentheses = false;
      const currencyPrefix = '$';
      const output = formatNumber(input, 2, 2, displayNegativeNumberWithParentheses, currencyPrefix);
      expect(output).toBe('-$123.00');
    });

    it('should return a formatted currency string with symbol prefix/suffix wrapped in parentheses when the input number is negative, when all necessary arguments are filled', () => {
      const input = -123;
      const displayNegativeNumberWithParentheses = true;
      const currencyPrefix = '$';
      const currencySuffix = ' CAD';
      const output = formatNumber(input, 2, 2, displayNegativeNumberWithParentheses, currencyPrefix, currencySuffix);
      expect(output).toBe('($123.00 CAD)');
    });

    it('should return a formatted currency string with symbol prefix/suffix but without decimals when these arguments are not provided, then wrapped in parentheses when the input number is negative, when all necessary arguments are filled', () => {
      const input = -123;
      const displayNegativeNumberWithParentheses = true;
      const currencyPrefix = '$';
      const currencySuffix = ' CAD';
      const output = formatNumber(input, null, null, displayNegativeNumberWithParentheses, currencyPrefix, currencySuffix);
      expect(output).toBe('($123 CAD)');
    });
  });

  describe('getDescendantProperty method', () => {
    let obj = {};
    beforeEach(() => {
      obj = { id: 1, user: { firstName: 'John', lastName: 'Doe', address: { number: 123, street: 'Broadway' } } };
    });

    it('should return undefined when search argument is not part of the input object', () => {
      const output = getDescendantProperty(obj, 'users');
      expect(output).toBe(undefined);
    });

    it('should return the object descendant even when path given is not a dot notation', () => {
      const output = getDescendantProperty(obj, 'user');
      expect(output).toEqual(obj['user']);
    });

    it('should return the object descendant when using dot notation', () => {
      const output = getDescendantProperty(obj, 'user.firstName');
      expect(output).toEqual('John');
    });

    it('should return the object descendant when using multiple levels of dot notation', () => {
      const output = getDescendantProperty(obj, 'user.address.street');
      expect(output).toEqual('Broadway');
    });
  });

  describe('parseBoolean method', () => {
    it('should return false when input value is not parseable to a boolean', () => {
      const output = parseBoolean('abc');
      expect(output).toBe(false);
    });

    it('should return false when input value the string "false"', () => {
      const output = parseBoolean('false');
      expect(output).toBe(false);
    });

    it('should return true when input value the string "true" case insensitive', () => {
      const output1 = parseBoolean('true');
      const output2 = parseBoolean('TRUE');

      expect(output1).toBe(true);
      expect(output2).toBe(true);
    });

    it('should return true when input value is the boolean true', () => {
      const output = parseBoolean(true);
      expect(output).toBe(true);
    });

    it('should return true when input value is number 1', () => {
      const output = parseBoolean(1);
      expect(output).toBe(true);
    });

    it('should return false when input value is 0 or any other number', () => {
      const output1 = parseBoolean(0);
      const output2 = parseBoolean(2);
      const output3 = parseBoolean(-4);

      expect(output1).toBe(false);
      expect(output2).toBe(false);
      expect(output3).toBe(false);
    });
  });

  describe('parseUtcDate method', () => {
    it('should return null when date provided is not an ISO date (date only accepted)', () => {
      const input1 = '2012-01-01 02:02:02';
      const input2 = '2012-01-01T02:02:02Z';

      const output1 = parseUtcDate(input1);
      const output2 = parseUtcDate(input2);

      expect(output1).toBeNull();
      expect(output2).toBeNull();
    });

    it('should return a date parsed as UTC when input is a date (without time) of ISO format', () => {
      const input = '2012-01-01';
      const output = parseUtcDate(input, true);
      expect(output).toBe('2012-01-01T00:00:00Z');
    });
  });

  describe('sanitizeHtmlToText method', () => {
    it('should return original value when input does not include any HTML tags', () => {
      const input = 'foo bar';
      const output = sanitizeHtmlToText(input);
      expect(output).toBe('foo bar');
    });

    it('should return a string with only the HTML text content without any HTML tags', () => {
      const input = '<div class="color: blue">Something</div>';
      const output = sanitizeHtmlToText(input);
      expect(output).toBe('Something');
    });

    it('should return the script content without javascript script tags when a script is provided', () => {
      const input = '<script>alert("Hello World")</script>';
      const output = sanitizeHtmlToText(input);
      expect(output).toBe('alert("Hello World")');
    });
  });

  describe('titleCase method', () => {
    const sentence = 'the quick brown fox';

    it('should return empty string when input is empty', () => {
      const output = titleCase('');
      expect(output).toBe('');
    });

    it('should return empty string when input is null', () => {
      const input = null;
      const output = titleCase(input);
      expect(output).toBe(null);
    });

    it('should return title case string that will uppercase each first char of every word', () => {
      const output = titleCase(sentence);
      expect(output).toBe('The quick brown fox');
    });

    it('should return title case string that will uppercase each first char of every word', () => {
      const caseEveryWords = true;
      const output = titleCase(sentence, caseEveryWords);
      expect(output).toBe('The Quick Brown Fox');
    });
  });

  describe('toCamelCase method', () => {
    const sentence = 'the quick brown fox';

    it('should return empty string when input is empty', () => {
      const output = toCamelCase('');
      expect(output).toBe('');
    });

    it('should return empty string when input is null', () => {
      const input = null;
      const output = toCamelCase(input);
      expect(output).toBe(null);
    });

    it('should return a camelCase string when input is a sentence', () => {
      const output = toCamelCase(sentence);
      expect(output).toBe('theQuickBrownFox');
    });

    it('should return a camelCase string when input is a sentence that may include numbers with next char being uppercase', () => {
      const output = toCamelCase(sentence + ' 123 ' + ' apples');
      expect(output).toBe('theQuickBrownFox123Apples');
    });
  });

  describe('toKebabCase method', () => {
    const sentence = 'the quick brown fox';

    it('should return empty string when input is empty', () => {
      const output = toKebabCase('');
      expect(output).toBe('');
    });

    it('should return empty string when input is null', () => {
      const input = null;
      const output = toKebabCase(input);
      expect(output).toBe(null);
    });

    it('should return a kebab-case string when input is a sentence', () => {
      const output = toKebabCase(sentence);
      expect(output).toBe('the-quick-brown-fox');
    });

    it('should return a kebab-case string when input is a sentence that may include numbers with only following char having the dash', () => {
      const output = toKebabCase(sentence + ' 123 ' + ' apples');
      expect(output).toBe('the-quick-brown-fox123-apples');
    });
  });

  describe('toSnakeCase method', () => {
    const sentence = 'the quick brown fox';

    it('should return empty string when input is empty', () => {
      const output = toSnakeCase('');
      expect(output).toBe('');
    });

    it('should return empty string when input is null', () => {
      const input = null;
      const output = toSnakeCase(input);
      expect(output).toBe(null);
    });

    it('should return a snake-case string when input is a sentence', () => {
      const output = toSnakeCase(sentence);
      expect(output).toBe('the_quick_brown_fox');
    });

    it('should return a snake_case string when input is a sentence that may include numbers with only following char having the dash', () => {
      const output = toSnakeCase(sentence + ' 123 ' + ' apples');
      expect(output).toBe('the_quick_brown_fox123_apples');
    });
  });

  describe('uniqueArray method', () => {
    it('should return original value when input is not an array', () => {
      const output1 = uniqueArray(null);
      const output2 = uniqueArray(undefined);

      expect(output1).toBeNull();
      expect(output2).toBe(undefined);
    });

    it('should return original array when array is empty', () => {
      const output = uniqueArray([]);
      expect(output).toEqual([]);
    });

    it('should return unique values when input array has duplicate string values', () => {
      const output = uniqueArray(['a', 'b', 'a']);
      expect(output).toEqual(['a', 'b']);
    });

    it('should return unique values when input array has duplicate number values', () => {
      const output = uniqueArray([1, 5, 2, 1, 5]);
      expect(output).toEqual([1, 5, 2]);
    });
  });

  describe('uniqueObjectArray method', () => {
    it('should return original value when input is not an array', () => {
      const output1 = uniqueObjectArray(null);
      const output2 = uniqueObjectArray(undefined);

      expect(output1).toBeNull();
      expect(output2).toBe(undefined);
    });

    it('should return original array when array is empty', () => {
      const output = uniqueObjectArray([]);
      expect(output).toEqual([]);
    });

    it('should return unique values when input array has duplicate objects', () => {
      const collection = [{ id: 9, name: 'a', order: 3 }, { id: 22, name: 'def', order: 45 }, { id: 9, name: 'a', order: 3 }];
      const output = uniqueObjectArray(collection, 'id');
      expect(output).toHaveLength(2);
    });
  });
});
