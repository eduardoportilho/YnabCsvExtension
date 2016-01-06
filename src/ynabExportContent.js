
/*
 * Extrai conteúdo YNAB da seleção e gera um arquivo para download
 */
var ynabExportSelectionText = function (selectionText) {
    console.log("ynabExportSelectionText: " + selectionText);
    var windowSelection = window.getSelection();
    var selectionElement = undefined;
    if(windowSelection) {
      selectionElementParent = windowSelection.anchorNode;
    }

    var ynabContent = YNAB.extractYNABContent(selectionText, selectionElement);
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
