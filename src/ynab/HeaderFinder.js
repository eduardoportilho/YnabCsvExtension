YnabHeaderFinder = (function(_utils){
    var exports = {};

    /**
     * Dados todos os headers de uma tabela, busca o índice do header que corresponda a um dos
     * valores possíveis. Se houver mais de um, usa o que tiver match com maior prioridade.
     *
     * @param headerValues Todos os headers de uma tabela
     * @param possibleNamesForSearchedHeader Nomes possíveis para o header desejado, em ordem
     * decrescente de prioridade
     * Exemplo:
     *  headerValues = ['data', 'valor', 'saldo']
     *  possibleNamesForSearchedHeader = ['total', 'valor', 'R$']
     *  resultado = 1
     */
    exports.findBetterMatch = function(headerValues, possibleNamesForSearchedHeader) {
        var prioridadeVsIndice = {},
            menorPrioridade = undefined;

        for (var headerIdx = 0 ; headerIdx < headerValues.length ; headerIdx++) {
            var headerVal = headerValues[headerIdx];
            for (var prio = 0 ; prio < possibleNamesForSearchedHeader.length ; prio++) {
                var possibleHeader = possibleNamesForSearchedHeader[prio];

                if(_utils.matchIgnoringCaseAndBlank(headerVal, possibleHeader)) {
                    prioridadeVsIndice[prio] = headerIdx;

                    if(menorPrioridade === undefined) {
                        menorPrioridade = prio;
                    } else {
                        menorPrioridade = Math.min(prio, menorPrioridade);
                    }
                }
            }
        }

        return (menorPrioridade === undefined) ? undefined : prioridadeVsIndice[menorPrioridade];
    };

    return exports;
}(Utils));