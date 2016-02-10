function Utils() {}

Utils.download = function (content, mimetype) {
    if(!mimetype) mimetype = "text/plain";
    var encodedUri = encodeURI("data:" + mimetype + ";charset=utf-8," + content);
    window.open(encodedUri);
}

/**
 * Converte um texto em um array (linhas) de arrays (colunas).
 * Separador de linha: \n
 * Separador de coluna: \t
 */
Utils.textTableToRowColArray = function (text) {
    var rows = [];
    var textRows = text.split('\n');
    for (var l=0;l<textRows.length;l++) {
        var row = [];
        var cols = textRows[l].split('\t');
        for (var c=0;c<cols.length;c++) {
            row.push(cols[c]);
        };
        rows.push(row);
    };
    return rows;
};

/**
 * Verifica se um array contém um valor
 * @param array
 * @param value
 * @returns {boolean}
 */
Utils.arrayContains = function(array, value) {
    return array.some(function(arrayValue){
        return arrayValue === value;
    });
};

/**
 * Verifica se um array de strings contém um valor ignorando case e leading/trailing spaces
 * @param stringArray
 * @param string
 * @returns {boolean}
 */
Utils.arrayContainsIgnoreCaseAndBlank = function(stringArray, string) {
    return stringArray.some(function(stringValue){
        return stringValue.toLowerCase().trim() === string.toLowerCase().trim();
    });
};

/**
 * Retorna os nós inicial e final da seleção
 * @returns {*[]}
 */
Utils.getSelectionNodes = function() {
    var selection = window.getSelection();
    var nodeA = selection.extentNode.parentElement;
    var nodeB = selection.baseNode.parentElement;
    return [nodeA, nodeB];
};

/**
 * 1) Localiza a primeira e a última TR que contém os nós selecionados
 * 2) Itera sobre todas as TRs da primeira até a última
 * 3) Extrai o conteúdo de texto dos TDs contidos em cada TR
 * 4) Retorna o conteúdo em um array (linhas) de arrays (colunas).
 * @param selectionNodes elementos dentro de TRs
 * @returns {Array}
 */
Utils.extractRowColArrayFromSelection = function(selectionNodes) {
    var nodeA = $(selectionNodes[0]);
    var nodeB = $(selectionNodes[1]);

    var rowA = nodeA.closest('tr');
    var rowB = nodeB.closest('tr');

    var indexA = rowA.index();
    var indexB = rowB.index();

    var row = indexA <= indexB ? rowA : rowB;
    var lastIndex = indexB > indexA ? indexB : indexA;

    var rows = [], rowContent;
    while(row.index() <= lastIndex) {
        rowContent = [];

        row.find('td').each(function(idx, el) {
            rowContent.push($(el).text().trim());
        });

        rows.push(rowContent);

        row = row.next();
    }
    return rows;
};


Utils.formatMoney = function(text) {
    return text.toNumber().format({decimalPlaces: 2});
};


Utils.formatDate = function(text) {
    var year, month, day;
    var tokens = text.split(/\D/);

    //YYYY-XX-XX
    if(tokens[0].length == 4) {
        year = tokens[0];
        month = tokens[1];
        day = tokens[2];
    }

    if(parseInt(month) > 12) {
        var temp = month;
        month = day;
        day = temp;
    }

    return day + '/' + month + '/' + year;
};

