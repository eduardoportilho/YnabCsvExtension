describe("[YNAB Transaction]", function () {

    it("should create an Tx", function () {
        var tx = new YnabTx('2000-01-31', 'payee,test', '10', '');
        expect(tx.date).toBe('31/01/2000');
        expect(tx.payee).toBe('payee;test');
        expect(tx.inflow).toBe('10.00');
        expect(tx.outflow).toBe('');
    });


    it("should generate CSV line", function () {
        var tx = new YnabTx('2000-01-31', 'payee,test', '10', '');
        expect(tx.toCsvLine()).toBe('31/01/2000,payee;test,,,,10.00');
    });
    

    it("should replace commas with semi colon in payee", function(){
        expect(YnabTx.clearCsvString('AAAA,BBBB')).toEqual('AAAA;BBBB');
        expect(YnabTx.clearCsvString(',,,')).toEqual(';;;');
    });
});
