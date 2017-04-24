function TabularDataFinder() {}

/**
 * 1) Localiza a primeira e a última TR que contém os nós selecionados
 * 2) Itera sobre todas as TRs da primeira até a última
 * 3) Extrai o conteúdo de texto dos TDs contidos em cada TR
 * 4) Retorna o conteúdo em um array (linhas) de arrays (colunas).
 * @param selectionNodes elementos dentro de TRs
 * @returns {Array}
 */
TabularDataFinder.extractRowColArrayFromSelection = function(selectionNodes) {
    var nodeA = $(selectionNodes[0]);
    var nodeB = $(selectionNodes[1]);

    var rowA = nodeA.closest('tr');
    var rowB = nodeB.closest('tr');

    if (rowA && rowB) {
      return TabularDataFinder.extractRowColArrayFromSelectionOnTable(rowA, rowB)
    }

    //TODO tratar outras estruturas (ex: divs)

};

TabularDataFinder.extractRowColArrayFromSelectionOnTable = function(rowA, rowB) {
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
