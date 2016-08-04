describe("[YnabColumnOrder]", function () {

    describe("Column Order Validator", function () {

        it("should consider empty order invalid", function () {
            expect(YnabColumnOrder.isValidColumnOrder({})).toBe(false);
        });

        it("should consider negative indexes invalid", function () {
            expect(YnabColumnOrder.isValidColumnOrder({date:-1})).toBe(false);
            expect(YnabColumnOrder.isValidColumnOrder({date:0, payee:-1})).toBe(false);
            expect(YnabColumnOrder.isValidColumnOrder({date:0, inflow:-1})).toBe(false);
        });

        it("should consider only date column as valid", function () {
            expect(YnabColumnOrder.isValidColumnOrder({date: 0})).toBe(true);
        });

        it("should consider valid", function () {
            expect(YnabColumnOrder.isValidColumnOrder({
                date: 3,
                payee: 5,
                inflow: 1
            })).toBe(true);
        });

        it("should consider duplicated indexes invalid", function () {
            expect(YnabColumnOrder.isValidColumnOrder({date:1, payee:1})).toBe(false);
        });
    });

    describe("Column Order From Header", function () {

        it("shouldn't find any column", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['xxx', 'yyyy']);
            expect(columnOrder).toEqual({});
        });

        it("should find date column", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['datum']);
            expect(columnOrder).toEqual({date: 0});
        });

        it("should find date column ignoring case", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['Datum']);
            expect(columnOrder).toEqual({date: 0});
        });

        it("should find date, payee and inflow", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['belopp', 'datum', 'transaktion']);
            expect(columnOrder).toEqual({
                date: 1,
                payee: 2,
                inflow: 0
            });
        });

        it("should consider other columns on the index count", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(
                ['xxx', 'belopp', 'yyy', 'datum', 'zzz', 'transaktion']);
            expect(columnOrder).toEqual({
                date: 3,
                payee: 5,
                inflow: 1
            });
        });
    });

    describe("Header From Table", function () {
        var elementOutsideTable;
        var elementInsideTable;
        var $rootElement;

        beforeEach(function () {
            $rootElement = $(
                    "<div id='rootElement'>" +
                    "<div id='outsideTable'>outside table</div>" +
                    "<table id='table'>" +
                    "<tbody>" +
                    "<tr><td id='insideTable'>inside table</td></tr>" +
                    "</tbody>" +
                    "</table>" +
                    "</div>"
            );
            $(document.body).append($rootElement);
            elementOutsideTable = $('#outsideTable').get(0);
            elementInsideTable = $('#insideTable').get(0);
        });

        afterEach(function () {
            rootElement.remove();
        });

        it("should not find header outside a table", function () {
            var result = YnabColumnOrder.tryToFindTableHeader(elementOutsideTable);
            expect(result.found).toBe(false);
        });

        it("should find nordea header in a table", function () {
            //given
            var header = $(
                    '<tr class="odd1">' +
                    '<th class="first" align="left">&nbsp;</th>' +
                    '<th align="left">Datum</th>' +
                    '<th align="left">Transaktion</th>' +
                    '<th align="left">Kategori</th>' +
                    '<th class="last forceright">Belopp</th>' +
                    '<th class="last forceright">Saldo</th>' +
                    '<th class="last">&nbsp;</th>' +
                    '</tr>');
            $('#rootElement #table tbody').prepend(header);

            //when
            var result = YnabColumnOrder.tryToFindTableHeader(elementInsideTable);

            //then
            expect(result.found).toBe(true);
            expect(result.value.join('|')).toEqual(" |Datum|Transaktion|Kategori|Belopp|Saldo| ");
        });


        it("should find header without th", function(){//given
            var header = $(
                '<tr class="odd1">' +
                '<td class="first" align="left">&nbsp;</td>' +
                '<td align="left">Datum</td>' +
                '<td align="left">Transaktion</td>' +
                '<td align="left">Kategori</td>' +
                '<td class="last forceright">Belopp</td>' +
                '<td class="last forceright">Saldo</td>' +
                '<td class="last">&nbsp;</td>' +
                '</tr>');
            $('#rootElement #table tbody').prepend(header);

            //when
            var result = YnabColumnOrder.tryToFindTableHeader(elementInsideTable);

            //then
            expect(result.found).toBe(true);
            expect(result.value.join('|')).toEqual(" |Datum|Transaktion|Kategori|Belopp|Saldo| ");
        });

    });

    describe("Nordea Gold colum order", function () {
        it("should find date, payee and inflow", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['Datum',
                'Transaktion', 'Mottagare', 'Valuta', 'Belopp SEK']);
            expect(columnOrder).toEqual({
                date: 0,
                payee: 2,
                inflow: 4
            });
        });

        it("should use Mottagare as payee", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['Datum',
                'Mottagare', 'Valuta', 'Transaktion', 'Belopp SEK']);
            expect(columnOrder).toEqual({
                date: 0,
                payee: 1,
                inflow: 4
            });
        });
    });

    describe("Santander colum order", function () {
        it("should find date, payee and inflow", function () {
            var columnOrder = YnabColumnOrder.findColumnOrderUsingTableHeader(['Data', 'Histórico', 'Docto.', 'Valor', 'Saldo']);
            expect(columnOrder).toEqual({
                date: 0,
                payee: 1,
                inflow: 3
            });
        });
    });

    describe("Column Order From Table", function () {
        var $rootElement;
        var clickedElement;

        beforeEach(function () {
            $rootElement = $(
                    "<div id='rootElement'>" +
                    "<table id='table'>" +
                    "<tbody>" +
                        '<tr class="odd1">' +
                            '<th class="first" align="left">&nbsp;</th>' +
                            '<th align="left">Datum</th>' +
                            '<th align="left">Transaktion</th>' +
                            '<th align="left">Kategori</th>' +
                            '<th class="last forceright">Belopp</th>' +
                            '<th class="last forceright">Saldo</th>' +
                            '<th id="clicked" class="last">&nbsp;</th>' +
                        '</tr>' +
                    "</tbody>" +
                    "</table>" +
                    "</div>"
            );
            $(document.body).append($rootElement);
            clickedElement = $('#clicked').get(0);
        });

        afterEach(function () {
            rootElement.remove();
        });

        it("should find order form nordea table", function () {
            var result = YnabColumnOrder.tryToFindColumnOrderFromElementInTable(clickedElement);
            expect(result.found).toBe(true);
            expect(result.value).toEqual({
                date:1,
                payee:2,
                inflow:4
            });
        });

        it("should find order form nordea table (2)", function () {
            var columnOrder = YnabColumnOrder.findColumnOrder(null, clickedElement);
            expect(columnOrder).toEqual({
                date:1,
                payee:2,
                inflow:4
            });
        });
    });

});