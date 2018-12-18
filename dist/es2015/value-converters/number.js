export class NumberValueConverter {
    fromView(value, format) {
        const number = parseFloat(value);
        return isNaN(number) ? value : number;
    }
}
//# sourceMappingURL=number.js.map