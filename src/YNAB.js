//TODO Depende de jQuery, Utils - Encapsular em IIFE e explicitar dependencias

function YNAB() {
}

/**
 * Retorna o conteúdo das transações no formato CSV YNAB
 * @param selectedElements Elementos inicial e final da seleção
 * @returns (string) conteúdo CSV
 */
YNAB.extractYNABContentFromSelectedElements = function (selectedElements) {
    var selectionTabularData = Utils.extractRowColArrayFromSelection(selectedElements);
    var columnOrder = YNAB.findColumnOrder(selectionTabularData, selectedElements[0]);
    var csv = YNAB.buildYnabCsv(selectionTabularData, columnOrder);
    return csv;
};

//TODO Modularizar
//COLUMN ORDER

/**
 * Determina o índice de cada tipo de coluna (date,payee,inflow)
 * @param tabularData dados em linhas e colunas
 * @param elementInTable elemento dentro da tabela que contém os dados (opcional)
 * @returns {*} object[headerType] = index
 */
YNAB.findColumnOrder = function (tabularData, elementInTable) {
    //1: header
    if (elementInTable) {
        var result = YNAB.tryToFindColumnOrderFromElementInTable(elementInTable);
        if (result.found) {
            return result.value;
        }
    }
    return YNAB.findColumnOrderUsingSelectionText(tabularData);

};

/**
 * Tenta descobrir a ordem das colunas lendo o header da tabela
 * @param elementInTable elemento dentro da tabela que contém os dados
 * @returns {*} optional: object[headerType] = index
 */
YNAB.tryToFindColumnOrderFromElementInTable = function (elementInTable) {
    var headerValuesOptional = YNAB.tryToFindTableHeader(elementInTable);
    if(!headerValuesOptional.found) {
        return {found: false};
    }
    var columnOrder = YNAB.findColumnOrderUsingTableHeader(headerValuesOptional.value);
    if(YNAB.isValidColumnOrder(columnOrder)) {
        return {found: true, value: columnOrder};
    }
    return {found: false};
};

/**
 * Tenta achar o header de uma tabela
 * @param elementInTable elemento dentro da tabela que contém os dados
 * @returns {*} optional: string array
 */
YNAB.tryToFindTableHeader = function(elementInTable) {
    var table = $(elementInTable).closest('table');
    if (table.length === 0) {
        return {found: false};
    }
    //1: primeira linha com th
    var th = table.find('th');
    if (th.length > 0) {
        var headerCols = th.first().parent().find('th');
        var headerVals = headerCols.map(function(i, el){
            return $(el).text();
        }).get();
        return {found: true, value: headerVals};
    }
    return {found: false};
};

// obj[headerType] = arrays de titulos possíveis
var POSSIBLE_HEADER_NAMES = {
    date: ['datum', 'date', 'data'],
    payee: ['transaktion', 'payee', 'descrição'],
    inflow: ['belopp', 'inflow', 'value']
};

/**
 * Tenta descobrir ordem das colunas a partir dos valores do header
 * @param headerValues string array
 * @returns {*} optional: object[headerType] = index
 */
YNAB.findColumnOrderUsingTableHeader = function (headerValues) {
    var columnOrder = {};

    for(var i = 0 ; i < headerValues.length ; i++) {
        var header = headerValues[i];
        for(var columnKey in POSSIBLE_HEADER_NAMES) {
            var nameList = POSSIBLE_HEADER_NAMES[columnKey];
            var headerIsIncludedOnNameList = Utils.arrayContainsIgnoreCaseAndBlank(nameList, header);
            if(headerIsIncludedOnNameList) {
                columnOrder[columnKey] = i;
                break;
            }
        }
    }

    return columnOrder;
};

/**
 * Verifica se uma ordem de colunas é valida
 * @param columnOrder object[headerType] = index
 * @returns boolean
 */
YNAB.isValidColumnOrder = function(columnOrder) {
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

        if(Utils.arrayContains(indexes, index)) {
            return false;
        }

        indexes.push(index);
    }
    return true;
};


YNAB.findColumnOrderUsingSelectionText = function (tabularData) {

};


YNAB.findHeaderTableHeaderRow = function (selectionElement) {

};


//TODO Modularizar
//CSV BUILDER

/**
 * Monta o CSV
 * @param tabularData dados em linhas e colunas
 * @param columnIndex índice das colunas
 */
YNAB.buildYnabCsv = function (tabularData, columnIndex) {
    var csv = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
    for(var row = 0 ; row < tabularData.length ; row++) {
        var rowValues = tabularData[row];

        var date = Utils.formatDate(rowValues[columnIndex.date]);
        var payee = columnIndex.payee >= 0 ? rowValues[columnIndex.payee] : '';
        var inflow = columnIndex.inflow >= 0 ? Utils.formatMoney(rowValues[columnIndex.inflow]) : '';
        var category = '';
        var memo = '';
        var outflow = '';

        csv += date + ',' + payee + ',' + category + ',' + memo + ',' + outflow + ',' + inflow + '\n';
    }
    return csv;
};

