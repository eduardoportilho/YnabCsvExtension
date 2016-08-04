YnabCsvGenerator = (function(utils, ynabColumnOrder, YnabTx){
    var exports = {};

    /**
     * Retorna o conteúdo das transações no formato CSV YNAB (ENTRY POINT)
     * @param selectedElements Elementos inicial e final da seleção
     * @returns (string) conteúdo CSV
     */
    exports.extractYNABContentFromSelectedElements = function (selectedElements) {
        var selectionTabularData = utils.extractRowColArrayFromSelection(selectedElements);
        var columnOrder = ynabColumnOrder.findColumnOrder(selectionTabularData, selectedElements[0]);
        var csv = exports.buildYnabCsv(selectionTabularData, columnOrder);
        return csv;
    };

    /**
     * Monta o CSV
     * @param tabularData dados em linhas e colunas
     * @param columnIndex índice das colunas
     */
    exports.buildYnabCsv = function (tabularData, columnIndex) {
        var csv = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
        for(var row = 0 ; row < tabularData.length ; row++) {
            var rowValues = tabularData[row];
            try {
                var date = rowValues[columnIndex.date];
                var payee = columnIndex.payee >= 0 ? rowValues[columnIndex.payee] : '';
                var inflow = columnIndex.inflow >= 0 ? rowValues[columnIndex.inflow] : '';
                var outflow = ''; //nunca preencho outflow. Ao invés, uso inflow negativo
                var ynabTx = new YnabTx(date, payee, inflow, outflow);
                csv += ynabTx.toCsvLine() + '\n';
            } catch(any) {
                console.log("Ignorando linha inválida: (" + rowValues + ")(" + any.message + ")");
            }
        }
        return csv;
    };

    return exports;
} (Utils, YnabColumnOrder, YnabTx));


