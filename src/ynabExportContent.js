
/*
 * Extract YNAB content from selected elements and generate the CSV file for dowload.
 */
var ynabExportSelectionText = function (selectionText) {
    var selectionNodes = Utils.getSelectionNodes();
    var ynabContent = YnabCsvGenerator.extractYNABContentFromSelectedElements(selectionNodes);
    Utils.download(ynabContent, 'text/csv');
};

/*
 * Handle background messages.
 */
chrome.extension.onMessage.addListener(function (message, sender, callback) {
	console.log("YnabExportContent: message received" + JSON.stringify(message));
    if (message.functiontoInvoke == "ynabExportSelectionText") {
        var selectionText = message.selectionText;
        ynabExportSelectionText(selectionText);
    }
});
