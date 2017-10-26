define(["require", "exports", "../models/operatorType", "rxjs/Observable", "moment", "rxjs/add/operator/first", "rxjs/add/operator/take", "rxjs/add/operator/toPromise"], function (require, exports, operatorType_1, Observable_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Try casting an input of type Promise | Observable into a Promise type.
     * @param input object which could be of type Promise or Observable
     * @param fromServiceName string representing the caller service name and will be used if we throw a casting problem error
     */
    function castToPromise(input, fromServiceName) {
        if (fromServiceName === void 0) { fromServiceName = ''; }
        var promise = input;
        if (input instanceof Promise) {
            // if it's already a Promise then return it
            return input;
        }
        else if (input instanceof Observable_1.Observable) {
            promise = input.first().toPromise();
            if (!(promise instanceof Promise)) {
                promise = input.take(1).toPromise();
            }
            if (!(promise instanceof Promise)) {
                throw new Error("Something went wrong, Angular-Slickgrid " + fromServiceName + " is not able to convert the Observable into a Promise.\n        If you are using Angular HttpClient, you could try converting your http call to a Promise with \".toPromise()\"\n        for example::  this.http.post('graphql', { query: graphqlQuery }).toPromise()\n        ");
            }
        }
        return promise;
    }
    exports.castToPromise = castToPromise;
    /**
     * Mapper for mathematical operators (ex.: <= is "le", > is "gt")
     * @param string operator
     * @returns string map
     */
    function mapOperatorType(operator) {
        var map;
        switch (operator) {
            case '<':
                map = operatorType_1.OperatorType.lessThan;
                break;
            case '<=':
                map = operatorType_1.OperatorType.lessThanOrEqual;
                break;
            case '>':
                map = operatorType_1.OperatorType.greaterThan;
                break;
            case '>=':
                map = operatorType_1.OperatorType.greaterThanOrEqual;
                break;
            case '<>':
            case '!=':
                map = operatorType_1.OperatorType.notEqual;
                break;
            case '*':
            case '.*':
            case 'startsWith':
                map = operatorType_1.OperatorType.startsWith;
                break;
            case '*.':
            case 'endsWith':
                map = operatorType_1.OperatorType.endsWith;
                break;
            case '=':
            case '==':
                map = operatorType_1.OperatorType.equal;
                break;
            default:
                map = operatorType_1.OperatorType.contains;
                break;
        }
        return map;
    }
    exports.mapOperatorType = mapOperatorType;
    /**
     * Parse a date passed as a string and return a Date object (if valid)
     * @param string inputDateString
     * @returns string date formatted
     */
    function parseUtcDate(inputDateString, useUtc) {
        var date = null;
        if (/^[0-9\-\/]*$/.test(inputDateString)) {
            // get the UTC datetime with moment.js but we need to decode the value so that it's valid text
            var dateString = decodeURIComponent(inputDateString);
            var dateMoment = moment(new Date(dateString));
            if (dateMoment.isValid() && dateMoment.year().toString().length === 4) {
                date = (useUtc) ? dateMoment.utc().format() : dateMoment.format();
            }
        }
        return date;
    }
    exports.parseUtcDate = parseUtcDate;
});
//# sourceMappingURL=utilities.js.map