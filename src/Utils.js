function Utils() {}

Utils.download = function (content, mimetype) {
    if(!mimetype) mimetype = "text/plain";
    var encodedUri = encodeURI("data:" + mimetype + ";charset=utf-8," + content);
    window.open(encodedUri);
};

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
        return Utils.equalsIgnoreCaseAndBlank(stringValue, string);
    });
};

Utils.equalsIgnoreCaseAndBlank = function(strA, strB) {
    return strA.toLowerCase().trim() === strB.toLowerCase().trim();
};

Utils.matchIgnoringCaseAndBlank = function(str, regexp) {
    var regexp = new RegExp(regexp, "gi");
    return regexp.test(str);
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
    while(row.length > 0 && row.index() <= lastIndex) {
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
    try {
        var tokens = text.split(/\D/);

        // DD-MM
        if(tokens.length === 2) {
            day = tokens[0];
            month = tokens[1];
            year = new Date().getFullYear();
        }
        else if(tokens.length === 3) {
            // YYYY-XX-XX
            if (tokens[0].length == 4) {
                year = tokens[0];
                month = tokens[1];
                day = tokens[2];
            }
            // DD-MM-YYYY
            else if (tokens[2].length == 4) {
                day = tokens[0];
                month = tokens[1];
                year = tokens[2];
            }
        }
        else {
            throw new Error("invalid length ");
        }

        if (parseInt(month) > 12) {
            var temp = month;
            month = day;
            day = temp;
        }

        return day + '/' + month + '/' + year;
    } catch (any) {
        throw new Error("Could not format date ["+ text +"] ("+ any.message+")");
    }
};

/**
 * Retorna os nós inicial e final da seleção
 * @returns {*[]}
 */
Utils.getSelectionNodes = function() {
    try {
        return Utils.getSelectionOnFramesOrFail([window]);
    } catch(any) {}
    return [];
};

Utils.getSelectionOnFramesOrFail = function(frames) {
    for (var i = 0, numFrames = frames.length; i < numFrames; i++) {
        try {
            return Utils.getSelectionNodesOnWindowOrFail(frames[i]);
        } catch(any) {}
    }

    for (var i = 0, numFrames = frames.length; i < numFrames; i++) {
        var subFrames = frames[i].frames;
        try {
            return Utils.getSelectionOnFramesOrFail(subFrames);
        } catch(any) {}
    }
    throw new Error();
};

Utils.getSelectionNodesOnWindowOrFail = function(aWindow) {
    var selection = aWindow.getSelection();
    if(selection.extentNode != null && selection.baseNode) {
        return [selection.extentNode.parentElement, selection.baseNode.parentElement];
    }
    throw new Error();
};
