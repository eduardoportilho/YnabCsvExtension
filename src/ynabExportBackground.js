
function ynabExportSelectionText(info, tab) {
  var selectionText = info.selectionText;

  chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "ynabExportSelectionText",
            "selectionText": selectionText
        });
    });


  // console.log("selectedText: |" + selectedText + "|");
  console.log("info: " + JSON.stringify(info, null, "\t"));
  console.log("tab: " + JSON.stringify(tab, null, "\t"));
}

chrome.contextMenus.create({
  "title": "Export to YNAB CSV",
  "contexts":["selection"],
  "onclick": ynabExportSelectionText
});
