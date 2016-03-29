describe("Utils", function() {

    describe("Date utils", function() {
        it("should format YYYY-MM-DD date", function() {
            expect(Utils.formatDate('2016-01-02')).toEqual('02/01/2016');
            expect(Utils.formatDate('2016\\01\\02')).toEqual('02/01/2016');
            expect(Utils.formatDate('2016-13-02')).toEqual('13/02/2016');
        });

        it("should format DD-MM-YYYY date", function() {
            expect(Utils.formatDate('02-01-2016')).toEqual('02/01/2016');
            expect(Utils.formatDate('02\\01\\2016')).toEqual('02/01/2016');
            expect(Utils.formatDate('02-13-2016')).toEqual('13/02/2016');
        });

        it("should format DD-MM date", function() {
            expect(Utils.formatDate('02-01')).toEqual('02/01/2016');
            expect(Utils.formatDate('02\\01')).toEqual('02/01/2016');
            expect(Utils.formatDate('02-13')).toEqual('13/02/2016');
        });
    });

    describe("Money utils", function() {
        it("should format 999,99 money", function() {
            expect(Utils.formatMoney('999,99')).toEqual('999.99');
        });
    });

    describe("RegExp utils", function() {
        it("should match", function() {
            expect(Utils.matchIgnoringCaseAndBlank(' Valor (R$)', 'valor')).toBeTruthy();
        });
        it("shouldn't match", function() {
            expect(Utils.matchIgnoringCaseAndBlank(' Valr (R$)', 'valor')).toBeFalsy();
        });
    });
});
