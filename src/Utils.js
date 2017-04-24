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
 * Format a number with 2 decimal places
 * @param {string} text Number as string
 * @return {string} Number as string with 2 decimal places or empty string if it fails
 */
Utils.formatMoney = function(text) {
    var number = text.toNumber();
    if (isNaN(number)) {
        return '';
    }
    return number.format({decimalPlaces: 2});
};

/**
 * Lenient date formater.
 * @param {string} text Date in any format
 * @return {string} Date in DD/MM/YYYY format
 */
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

/**
 * Get the initial and final elements of the selection.
 * @param  {Window} aWindow - Window of the selection.
 * @return {Element[]} Initial (0) and final (1) elements of the selection.
 * @throws {Error} If not able to get selection.
 */
Utils.getSelectionNodesOnWindowOrFail = function(aWindow) {
    // Selection object: https://developer.mozilla.org/en-US/docs/Web/API/Selection
    var selection = aWindow.getSelection();
    //baseNode is alias for anchorNode, extentNode for focusNode (Both Node objects)
    if(selection.extentNode != null && selection.baseNode) {
        return [selection.extentNode.parentElement, selection.baseNode.parentElement];
    }
    throw new Error();
};

Utils.isEmpty = function(aString) {
    return aString === undefined ||
        aString === null ||
        aString.length === 0;
};
