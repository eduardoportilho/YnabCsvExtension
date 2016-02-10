
/*
 * Extrai conteúdo YNAB da seleção e gera um arquivo para download
 */
var ynabExportSelectionText = function (selectionText) {
    /** Uncomment to debug ** /
    console.debug();
    /**/

    /** Extrai a partir dos elementos selecionados **/
    var selectionNodes = Utils.getSelectionNodes();
    var ynabContent = YNAB.extractYNABContentFromSelectedElements(selectionNodes);
    /** Extrai a partir dos elementos selecionados **/

    /** Extrai a partir do texto selecionado ** /
    //TODO Não esta funcionando
    var windowSelection = window.getSelection();
    var selectionElement = undefined;
    if(windowSelection) {
        selectionElement = windowSelection.anchorNode;
    }
    var ynabContent = YNAB.extractYNABContent(selectionText, selectionElement);
    /** Extrai a partir do texto selecionado **/

    Utils.download(ynabContent, 'text/csv');
};


/*
 * Recebe mensagens do background
 */
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "ynabExportSelectionText") {
        var selectionText = message.selectionText;
        ynabExportSelectionText(selectionText);
    }
});
