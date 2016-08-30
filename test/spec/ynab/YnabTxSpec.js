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

    it("should detect income", function () {
        expect(new YnabTx('2000-01-31', 'payee,test', '10', '').isIncome()).toBeTruthy();
        expect(new YnabTx('2000-01-31', 'payee,test', '', '-10').isIncome()).toBeTruthy();
    });

    it("should detect outcome", function () {
        expect(new YnabTx('2000-01-31', 'payee,test', '-10', '').isIncome()).toBeFalsy();
        expect(new YnabTx('2000-01-31', 'payee,test', '', '10').isIncome()).toBeFalsy();
    });

    it("should flip income", function () {
        var tx = new YnabTx('2000-01-31', 'payee,test', '10', '');
        tx.flipIncomeOutcome();
        expect(tx.inflow).toBe('-10.00');
        expect(tx.outflow).toBe('');

        tx.flipIncomeOutcome();
        expect(tx.inflow).toBe('10.00');
        expect(tx.outflow).toBe('');
    });

    it("should flip outcome", function () {
        var tx = new YnabTx('2000-01-31', 'payee,test', '', '10');
        tx.flipIncomeOutcome();
        expect(tx.inflow).toBe('');
        expect(tx.outflow).toBe('-10.00');

        tx.flipIncomeOutcome();
        expect(tx.inflow).toBe('');
        expect(tx.outflow).toBe('10.00');
    });

});
