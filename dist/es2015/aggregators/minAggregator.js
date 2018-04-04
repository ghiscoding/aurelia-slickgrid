export class MinAggregator {
    constructor(field) {
        this._field = field;
    }
    init() {
        this._min = null;
    }
    accumulate(item) {
        const val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
        if (val != null && val !== '' && !isNaN(val)) {
            if (this._min == null || val < this._min) {
                this._min = val;
            }
        }
    }
    storeResult(groupTotals) {
        if (!groupTotals.min) {
            groupTotals.min = {};
        }
        groupTotals.min[this._field] = this._min;
    }
}
//# sourceMappingURL=minAggregator.js.map