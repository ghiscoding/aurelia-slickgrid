export class AvgAggregator {
    constructor(field) {
        this._count = 0;
        this._field = field;
    }
    init() {
        this._count = 0;
        this._nonNullCount = 0;
        this._sum = 0;
    }
    accumulate(item) {
        const val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
        this._count++;
        if (val != null && val !== '' && !isNaN(val)) {
            this._nonNullCount++;
            this._sum += parseFloat(val);
        }
    }
    storeResult(groupTotals) {
        if (!groupTotals.avg) {
            groupTotals.avg = {};
        }
        if (this._nonNullCount !== 0) {
            groupTotals.avg[this._field] = this._sum / this._nonNullCount;
        }
    }
}
//# sourceMappingURL=avgAggregator.js.map