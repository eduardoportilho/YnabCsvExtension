
/*
 * Extrai conteúdo YNAB da seleção e gera um arquivo para download
 */
var ynabExportSelectionText = function (selectionText) {
    console.log("ynabExportSelectionText: " + selectionText);

    //Extrai a partir dos elementos selecionados
    var selectionNodes = Utils.getSelectionNodes();
    var ynabContent = YNAB.extractYNABContentFromSelectedElements(selectionNodes);

    //Extrai a partir do texto selecionado
    //TODO Não esta funcionando
    //var windowSelection = window.getSelection();
    //var selectionElement = undefined;
    //if(windowSelection) {
    //    selectionElement = windowSelection.anchorNode;
    //}
    //var ynabContent = YNAB.extractYNABContent(selectionText, selectionElement);

    Utils.download(ynabContent);
}


/*
 * Recebe mensagens do background
 */
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "ynabExportSelectionText") {
        var selectionText = message.selectionText;
        ynabExportSelectionText(selectionText);
    }
});
