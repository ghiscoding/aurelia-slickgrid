export class AsgNumberValueConverter {
    fromView(value, format) {
        const number = parseFloat(value);
        return isNaN(number) ? value : number;
    }
}
//# sourceMappingURL=asgNumber.js.map