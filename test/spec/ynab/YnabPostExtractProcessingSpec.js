//YnabPostExtractProcessingSpec
describe("[Ynab Post Extract Processing]", function () {

    it("should flip txs when income count > outcome count", function () {
        var txs = [
        	new YnabTx('2000-01-31', 'payee,test', '1', ''),
        	new YnabTx('2000-01-31', 'payee,test', '2', ''),
        	new YnabTx('2000-01-31', 'payee,test', '-3', '')
        ];
        YnabPostExtractProcessing.processInplace(txs);
        expect(txs[0].inflow).toBe('-1.00');
        expect(txs[0].outflow).toBe('');

        expect(txs[1].inflow).toBe('-2.00');
        expect(txs[1].outflow).toBe('');

        expect(txs[2].inflow).toBe('3.00');
        expect(txs[2].outflow).toBe('');
    });
});