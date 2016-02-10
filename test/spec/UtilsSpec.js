describe("Utils x", function() {

    xit("should ...", function() {
      expect(false).toBeTruthy();
    });

    describe("Date utils", function() {
        it("should format YYYY-MM-DD date", function() {
            expect(Utils.formatDate('2016-01-02')).toEqual('02/01/2016');
            expect(Utils.formatDate('2016\\01\\02')).toEqual('02/01/2016');
            expect(Utils.formatDate('2016-13-02')).toEqual('13/02/2016');
        });
    });

    describe("Money utils", function() {
        it("should format 999,99 money", function() {
            expect(Utils.formatMoney('999,99')).toEqual('999.99');
        });
    });
});
