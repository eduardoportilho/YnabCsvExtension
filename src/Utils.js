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


Utils.getSelectionNodes = function() {
    var selection = window.getSelection();
    var nodeA = selection.extentNode.parentElement;
    var nodeB = selection.baseNode.parentElement;
    console.log(nodeA, nodeB);

};

