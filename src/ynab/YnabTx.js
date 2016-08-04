
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

    /**
     * Remove characters not allowed in CSV
     */
    YnabTx.clearCsvString = function(string) {
        return string.replace(/,/g, ';');
    }

    return YnabTx;
}(Utils));
