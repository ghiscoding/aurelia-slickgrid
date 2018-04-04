export class MaxAggregator {
    constructor(field) {
        this._field = field;
    }
    init() {
        this._max = null;
    }
    accumulate(item) {
        const val = (item && item.hasOwnProperty(this._field)) ? item[this._field] : null;
        if (val != null && val !== '' && !isNaN(val)) {
            if (this._max == null || val > this._max) {
                this._max = val;
            }
        }
    }
    storeResult(groupTotals) {
        if (!groupTotals.max) {
            groupTotals.max = {};
        }
        groupTotals.max[this._field] = this._max;
    }
}
//# sourceMappingURL=maxAggregator.js.map