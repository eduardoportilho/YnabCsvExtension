describe("[HeaderFinder]", function () {

    describe("[Header matcher]", function () {
        var possibleHeaders = ['bb', 'bbb'];

        it("should find match", function () {
            var headerIdx = YNABChrome.HeaderFinder.findBetterMatch(['aaa', 'bbb', 'ccc'], possibleHeaders);
            expect(headerIdx).toBe(1);
        });

        it("should find higher priority header", function () {
            var headerIdx = YNABChrome.HeaderFinder.findBetterMatch(['aaa', 'bbb', 'ccc', 'bb'], possibleHeaders);
            expect(headerIdx).toBe(3);
        });

        it("should find match whith part of the header", function () {
            var headerDaTabela = ['Data', 'Valor (R$)', ''];
            var headersValor = ['Amount', 'Valor'];

            var headerIdx = YNABChrome.HeaderFinder.findBetterMatch(headerDaTabela, headersValor);
            expect(headerIdx).toBe(1);
        });

    });
});