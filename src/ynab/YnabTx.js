
/**
 * YNAB Transaction
 * @require _utils Utils.js
 */
YnabTx = (function(_utils){
    /**
     * @param date {string} Date in any format
     * @param payee {string} Payee
     * @param inflow {string} Inflow amount
     * @param outflow {string} Outflow amount
     */
    function YnabTx(date, payee, inflow, outflow) {
    	this.date = _utils.formatDate(date); //Date in DD/MM/YYYY format
    	this.payee = YnabTx.clearCsvString(payee);
    	this.inflow = _utils.formatMoney(inflow); //Two decimal places
    	this.outflow = _utils.formatMoney(outflow); //Two decimal places
    }

    /*
     * Return the tx data as a CSV line string
     */
    YnabTx.prototype.toCsvLine = function() {
        var category = '';
        var memo = '';
        return this.date + ',' + 
            this.payee + ',' + 
            category + ',' + 
            memo + ',' + 
            this.outflow + ',' + 
            this.inflow;
    };

    YnabTx.prototype.isIncome = function() {
        if(!_utils.isEmpty(this.inflow)) {
            return this.inflow[0] !== '-';
        }
        else if(!_utils.isEmpty(this.outflow)) {
            return this.outflow[0] === '-';
        }
        return false;
    };

    YnabTx.prototype.flipIncomeOutcome = function() {
        if(!_utils.isEmpty(this.inflow)) {
            this.inflow = YnabTx.flip(this.inflow);
        }
        if(!_utils.isEmpty(this.outflow)) {
            this.outflow = YnabTx.flip(this.outflow);
        }
    }

    /**
     * Remove characters not allowed in CSV
     */
    YnabTx.clearCsvString = function(string) {
        return string.replace(/,/g, ';');
    }

    YnabTx.flip = function(string) {
        if(string[0] === '-') {
            return string.replace(/\-/g, '');
        } else {
            return '-' + string;
        }
    }

    return YnabTx;
}(Utils));
