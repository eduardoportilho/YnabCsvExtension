YnabCsvGenerator = (function(utils, ynabColumnOrder, YnabTx, ynabPostExtractProcessing){
    var exports = {};

    /**
     * Retorna o conteúdo das transações no formato CSV YNAB (ENTRY POINT)
     * @param selectedElements Elementos inicial e final da seleção
     * @returns (string) conteúdo CSV
     */
    exports.extractYNABContentFromSelectedElements = function (selectedElements) {
        var selectionTabularData = utils.extractRowColArrayFromSelection(selectedElements);
        var columnOrder = ynabColumnOrder.findColumnOrder(selectionTabularData, selectedElements[0]);
        var ynabTxs = exports.generateTxs(selectionTabularData, columnOrder);
        ynabPostExtractProcessing.processInplace(ynabTxs);
        var csv = exports.buildCsvString(ynabTxs);
        return csv;
    };

    exports.buildYnabCsv = function (tabularData, columnOrder) {
        var ynabTxs = exports.generateTxs(tabularData, columnOrder);
        return exports.buildCsvString(ynabTxs);
    };

    /**
     * Build the array of transactions
     */
    exports.generateTxs = function (tabularData, columnIndex) {
        var txs = [];
        for(var row = 0 ; row < tabularData.length ; row++) {
            var rowValues = tabularData[row];
            try {
                var date = rowValues[columnIndex.date];
                var payee = columnIndex.payee >= 0 ? rowValues[columnIndex.payee] : '';
                var inflow = columnIndex.inflow >= 0 ? rowValues[columnIndex.inflow] : '';
                var outflow = ''; //nunca preencho outflow. Ao invés, uso inflow negativo
                var ynabTx = new YnabTx(date, payee, inflow, outflow);
                txs.push(ynabTx);
            } catch(any) {
                console.log("Ignorando linha inválida: (" + rowValues + ")(" + any.message + ")");
            }
        }
        return txs;
    };

    /**
     * Build the CSV string
     * @param ynabTxs array of YnabTx
     */
    exports.buildCsvString = function (ynabTxs) {
        var csv = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
        for(var txIdx = 0 ; txIdx < ynabTxs.length ; txIdx++) {
            var ynabTx = ynabTxs[txIdx];
            csv += ynabTx.toCsvLine() + '\n';
        }
        return csv;
    }

    return exports;
} (Utils, YnabColumnOrder, YnabTx, YnabPostExtractProcessing));


