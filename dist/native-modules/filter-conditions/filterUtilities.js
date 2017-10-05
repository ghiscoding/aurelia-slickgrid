import { FieldType } from '../models/fieldType';
export var mapDateFormatByFieldType = function (fieldType) {
    switch (fieldType) {
        case FieldType.dateUs:
            return 'M/D/YYYY';
        case FieldType.dateTimeUs:
            return 'M/D/YYYY h:m:s';
        case FieldType.dateUsShort:
            return 'M/D/YY';
        case FieldType.dateTimeUsShort:
            return 'M/D/YY h:m:s';
        case FieldType.dateTimeIso:
            return 'YYYY-MM-DD h:m:s';
        case FieldType.dateIso:
        default:
            return 'YYYY-MM-DD';
    }
};
export var testFilterCondition = function (operator, value1, value2) {
    switch (operator) {
        case '<': return (value1 < value2);
        case '<=': return (value1 <= value2);
        case '>': return (value1 > value2);
        case '>=': return (value1 >= value2);
        case '!=':
        case '<>': return (value1 !== value2);
        case '=':
        case '==': return (value1 === value2);
    }
    return true;
};
