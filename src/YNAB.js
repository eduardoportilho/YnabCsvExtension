function YNAB() {
}

// var csv = 'Date,Payee,Category,Memo,Outflow,Inflow\n';


/**
 * Retorna o conteúdo das transações no formato CSV YNAB
 * @param selectionText: texto selecionado (opcional)
 * @param selectionElement: elemento dentro da tabela contendo os dados  (opcional)
 * @returns {*}
 */
YNAB.extractYNABContent = function (selectionText, selectionElement) {
    if (selectionText && selectionElement) {
        return YNAB.extractYNABContentFromTextAndElement(selectionText, selectionElement);
    }
    else if (selectionText && !selectionElement) {
        return YNAB.extractYNABContentFromText(selectionText);
    }
    else if (!selectionText && selectionElement) {
        return YNAB.extractYNABContentFromElement(selectionElement);
    }
    return "";
};

/**
 * Idem extractYNABContent porém com ambos parametros obrigatórios
 */
YNAB.extractYNABContentFromTextAndElement = function (selectionText, selectionElement) {
    var selectionTabularData = Utils.textTableToRowsArray(selectionText);
    var columnOrder = YNAB.findColumnOrder(selectionTabularData, selectionElement);
    var csv = YNAB.buildYnabCsv(rows, columnOrder);
    return csv;
};

/**
 * Idem extractYNABContent porém apenas com selectionText obrigatório
 */
YNAB.extractYNABContentFromText = function (selectionText) {

};

/**
 * Idem extractYNABContent porém apenas com selectionElement obrigatório
 */
YNAB.extractYNABContentFromElement = function (selectionElement) {

};

//COLUMN ORDER

/**
 * Determina o índice de cada tipo de coluna (date,payee,inflow)
 * @param tabularData dados em linhas e colunas
 * @param elementInTable elemento dentro da tabela que contém os dados (opcional)
 * @returns {*}
 */
YNAB.findColumnOrder = function (tabularData, elementInTable) {
    //1: header
    if (elementInTable) {
        var result = YNAB.tryToFindColumnOrderFromElementInTable(elementInTable);
        if (result.found) {
            return result.columnOrder;
        }
    }
    return findColumnOrderUsingSelectionText(tabularData);

};

/**
 * Tenta descobrir a ordem das colunas lendo o header da tabela (obrigatótio
 * @param elementInTable elemento dentro da tabela que contém os dados
 * @returns {*}
 */
YNAB.tryToFindColumnOrderFromElementInTable = function (elementInTable) {
    var headerValuesOptional = YNAB.tryToFindTableHeader(elementInTable);
    return YNAB.tryToFindColumnOrderUsingTableHeader(headerValuesOptional);
};

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


var POSSIBLE_HEADER_NAMES = {
    date: ['datum', 'date', 'data'],
    payee: ['transaktion', 'payee', 'descrição'],
    inflow: ['belopp', 'inflow', 'value']
};

YNAB.tryToFindColumnOrderUsingTableHeader = function (headerValuesOptional) {
    if(!headerValuesOptional.found) {
        return {found: false};
    }
    var headerValues = headerValuesOptional.value;


    var columnOrder = {};

    for(var i = 0 ; i < headerValues.length ; i++) {
        var header = headerValues[i];
        for(var columnKey in POSSIBLE_HEADER_NAMES) {
            var nameList = POSSIBLE_HEADER_NAMES[columnKey];
            var headerIsIncludedOnNameList = nameList.some(function(possibleName){
                return possibleName === header;
            });

            if(headerIsIncludedOnNameList) {
                columnOrder[columnKey] = i;
                break;
            }
        }
    }
    if(YNAB.isValidColumnOrder(columnOrder)) {
        return {found: true, value: columnOrder};
    }

    return {found: false};
};

YNAB.isValidColumnOrder = function() {

};





YNAB.findColumnOrderUsingSelectionText = function (tabularData) {

};


YNAB.findHeaderTableHeaderRow = function (selectionElement) {

};

//CSV BUILDER

YNAB.buildYnabCsv = function (tabularData, columnOrder) {

};
