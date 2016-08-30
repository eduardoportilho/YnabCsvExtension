YnabPostExtractProcessing = (function(){
    var exports = {};

    exports.processInplace = function(ynabTxs) {
    	var stats = exports.getTxsStats(ynabTxs);
        //1: if more than X% of the transactions are positive, probably is a credit card, so flip it
        if(stats.incomePercent > 0.6) {
        	exports.flipIncomeOutcomeInplace(ynabTxs);
        }
    };

    exports.getTxsStats = function(ynabTxs) {
    	var incomeCount = 0;
    	var outcomeCount = 0;

        for(var txIdx = 0 ; txIdx < ynabTxs.length ; txIdx++) {
            var ynabTx = ynabTxs[txIdx];
            if(ynabTx.isIncome()) {
            	incomeCount++;
            } else {
            	outcomeCount++;
            }
        }
        var incomePercent = incomeCount / (ynabTxs.length);
        return {
        	incomePercent: incomePercent,
        	incomeCount: incomeCount,
        	outcomeCount: outcomeCount
        }
    };

    exports.flipIncomeOutcomeInplace = function(ynabTxs) {
        for(var txIdx = 0 ; txIdx < ynabTxs.length ; txIdx++) {
            ynabTxs[txIdx].flipIncomeOutcome();
        }
    };

    return exports;
} ());