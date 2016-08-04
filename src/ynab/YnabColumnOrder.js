YnabColumnOrder = (function(jQuery, headerFinder, _utils){
    var exports = {};

    /**
     * m(headerType) => arrays de titulos possíveis
     */
    var POSSIBLE_HEADER_NAMES = {
        date: ['datum', 'date', 'data'],
        payee: ['mottagare', 'transaktion', 'payee', 'descrição', 'histórico', 'lançamento'],
        inflow: ['belopp', 'belopp sek', 'inflow', 'value', 'valor']
    };
    /**
     * Determina o índice de cada tipo de coluna (date,payee,inflow)
     * @param tabularData dados em linhas e colunas
     * @param anElementInTable elemento dentro da tabela que contém os dados (opcional)
     * @returns {*} object[headerType] = index
     */
    exports.findColumnOrder = function (tabularData, anElementInTable) {
        //1: header
        if (anElementInTable) {
            var result = exports.tryToFindColumnOrderFromElementInTable(anElementInTable);
            if (result.found) {
                return result.value;
            }
        }
        return exports.findColumnOrderUsingSelectionText(tabularData);
    };

    /**
     * Tenta descobrir a ordem das colunas lendo o header da tabela
     * @param anElementInTable elemento dentro da tabela que contém os dados
     * @returns {*} optional: object[headerType] = index
     */
    exports.tryToFindColumnOrderFromElementInTable = function (anElementInTable) {
        var headerValuesOptional = exports.tryToFindTableHeader(anElementInTable);
        if(!headerValuesOptional.found) {
            return {found: false};
        }
        var columnOrder = exports.findColumnOrderUsingTableHeader(headerValuesOptional.value);
        if(exports.isValidColumnOrder(columnOrder)) {
            return {found: true, value: columnOrder};
        }
        return {found: false};
    };

    /**
     * Tenta achar o header de uma tabela
     * @param anElementInTable elemento dentro da tabela que contém os dados
     * @returns {*} optional: string array
     */
    exports.tryToFindTableHeader = function(anElementInTable) {
        var table = jQuery(anElementInTable).closest('table');
        if (table.length === 0) {
            return {found: false};
        }
        //1: primeira linha com th
        var th = table.find('th');
        if (th.length > 0) {
            var headerCols = th.first().parent().find('th');
            var headerVals = headerCols.map(function(i, el){
                return jQuery(el).text();
            }).get();
            return {found: true, value: headerVals};
        }
        //2: primeira linha da tabela
        var firstRow = table.find('tr:first');
        if (firstRow.length > 0) {
            var headerCols = firstRow
                .find('td')
                .filter(function(i,td) {
                    //ignora tds com filhos
                    return jQuery(td).children().length === 0;
                });
            var headerVals = headerCols.map(function (i, el) {
                return jQuery(el).text();
            }).get();
            return {found: true, value: headerVals};
        }
        return {found: false};
    };

    /**
     * Tenta descobrir ordem das colunas a partir dos valores do header
     * @param headerValues string array, valores do header
     * @returns {*} optional: object[headerType] = index
     */
    exports.findColumnOrderUsingTableHeader = function (headerValues) {
        var columnOrder = {};

        for(var columnKey in POSSIBLE_HEADER_NAMES) {
            var possibleHeaders = POSSIBLE_HEADER_NAMES[columnKey];
            var index = headerFinder.findBetterMatch(headerValues, possibleHeaders);
            if(index >= 0) {
                columnOrder[columnKey] = index;
            }
        }

        return columnOrder;
    };

    /**
     * Verifica se uma ordem de colunas é valida
     * @param columnOrder object[headerType] = index
     * @returns boolean
     */
    exports.isValidColumnOrder = function(columnOrder) {
        //tem a coluna date?
        if(!(columnOrder.date >=0)) {
            return false;
        }
        var indexes = [];

        for(var k in columnOrder) {
            var index = columnOrder[k];

            if(!(index >= 0)) {
                return false;
            }

            if(_utils.arrayContains(indexes, index)) {
                return false;
            }

            indexes.push(index);
        }
        return true;
    };

    return exports;
    
} (jQuery, YnabHeaderFinder, Utils));
