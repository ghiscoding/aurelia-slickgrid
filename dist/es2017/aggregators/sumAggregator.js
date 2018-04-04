export class SumAggregator {
    constructor(field) {
        this._sum = 0;
        this._field = field;
    }
    init() {
        this._sum = 0;
    }
    accumulate(item) {
        const val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
        if (val != null && val !== '' && !isNaN(val)) {
            this._sum += parseFloat(val);
        }
    }
    storeResult(groupTotals) {
        if (!groupTotals.sum) {
            groupTotals.sum = {};
        }
        groupTotals.sum[this._field] = this._sum;
    }
}
//# sourceMappingURL=sumAggregator.js.map