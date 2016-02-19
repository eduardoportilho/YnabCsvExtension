describe("YNAB", function () {

    describe("Header matcher", function () {
        var possibleHeaders = ['bb', 'bbb'];

        it("should find match", function () {
            var headerIdx = YNAB.findBetterMatch(['aaa', 'bbb', 'ccc'], possibleHeaders);
            expect(headerIdx).toBe(1);
        });

        it("should find higher priority header", function () {
            var headerIdx = YNAB.findBetterMatch(['aaa', 'bbb', 'ccc', 'bb'], possibleHeaders);
            expect(headerIdx).toBe(3);
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
            var result = YNAB.tryToFindTableHeader(elementOutsideTable);
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
            var result = YNAB.tryToFindTableHeader(elementInsideTable);

            //then
            expect(result.found).toBe(true);
            expect(result.value.join('|')).toEqual(" |Datum|Transaktion|Kategori|Belopp|Saldo| ");
        });

    });


    describe("Column Order From Header", function () {

        it("shouldn't find any column", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(['xxx', 'yyyy']);
            expect(columnOrder).toEqual({});
        });

        it("should find date column", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(['datum']);
            expect(columnOrder).toEqual({date: 0});
        });

        it("should find date column ignoring case", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(['Datum']);
            expect(columnOrder).toEqual({date: 0});
        });

        it("should find date, payee and inflow", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(['belopp', 'datum', 'transaktion']);
            expect(columnOrder).toEqual({
                date: 1,
                payee: 2,
                inflow: 0
            });
        });

        it("should consider other columns on the index count", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(
                ['xxx', 'belopp', 'yyy', 'datum', 'zzz', 'transaktion']);
            expect(columnOrder).toEqual({
                date: 3,
                payee: 5,
                inflow: 1
            });
        });

    });

    describe("Nordea Gold colum order", function () {

        it("should find date, payee and inflow", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(['Datum',
                'Transaktion', 'Mottagare', 'Valuta', 'Belopp SEK']);
            expect(columnOrder).toEqual({
                date: 0,
                payee: 2,
                inflow: 4
            });
        });

        it("should use Mottagare as payee", function () {
            var columnOrder = YNAB.findColumnOrderUsingTableHeader(['Datum',
                'Mottagare', 'Valuta', 'Transaktion', 'Belopp SEK']);
            expect(columnOrder).toEqual({
                date: 0,
                payee: 1,
                inflow: 4
            });
        });

    });

    describe("Column Order Validator", function () {

        it("should consider empty order invalid", function () {
            expect(YNAB.isValidColumnOrder({})).toBe(false);
        });

        it("should consider negative indexes invalid", function () {
            expect(YNAB.isValidColumnOrder({date:-1})).toBe(false);
            expect(YNAB.isValidColumnOrder({date:0, payee:-1})).toBe(false);
            expect(YNAB.isValidColumnOrder({date:0, inflow:-1})).toBe(false);
        });

        it("should consider only date column as valid", function () {
            expect(YNAB.isValidColumnOrder({date: 0})).toBe(true);
        });

        it("should consider valid", function () {
            expect(YNAB.isValidColumnOrder({
                date: 3,
                payee: 5,
                inflow: 1
            })).toBe(true);
        });

        it("should consider duplicated indexes invalid", function () {
            expect(YNAB.isValidColumnOrder({date:1, payee:1})).toBe(false);
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
            var result = YNAB.tryToFindColumnOrderFromElementInTable(clickedElement);
            expect(result.found).toBe(true);
            expect(result.value).toEqual({
                date:1,
                payee:2,
                inflow:4
            });
        });

        it("should find order form nordea table (2)", function () {
            var columnOrder = YNAB.findColumnOrder(null, clickedElement);
            expect(columnOrder).toEqual({
                date:1,
                payee:2,
                inflow:4
            });
        });

    });

    describe("CSV builder", function () {
        var header = 'Date,Payee,Category,Memo,Outflow,Inflow\n';

        it("should build empty csv if there is no data", function () {
            var csv = YNAB.buildYnabCsv([], {});
            expect(csv).toEqual(header);
        });

        it("should build csv", function () {
            var csv = YNAB.buildYnabCsv([
                ['1000', 'Payee A', '2015/01/01'],
                ['-1000', 'Payee B', '2015/01/02']
            ], {inflow:0, payee:1, date: 2});
            expect(csv).toEqual(header +
                '01/01/2015,Payee A,,,,1000.00\n' +
                '02/01/2015,Payee B,,,,-1000.00\n'
            );
        });

        it("should ignore empty lines", function () {
            var csv = YNAB.buildYnabCsv([
                ['1000', 'Payee A', '2015/01/01'],
                [],
                ['-1000', 'Payee B', '2015/01/02']
            ], {inflow:0, payee:1, date: 2});
            expect(csv).toEqual(header +
                '01/01/2015,Payee A,,,,1000.00\n' +
                '02/01/2015,Payee B,,,,-1000.00\n'
            );
        });

    });

    describe("Extract Content", function () {
        var header = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
        var $rootElement;
        var selection;

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
                    '<th class="last">&nbsp;</th>' +
                    '</tr>' +

                    '<tr class="even">' +
                    '<td class="first odd4">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="left">2016-01-04</td>' +
                    '<td id="selectionStart" class="nowrap odd4" align="left">Payee A</td>' +
                    '<td class="odd4" align="left">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="right">150,00</td>' +
                    '<td class="nowrap odd4" align="right">&nbsp;</td>' +
                    '<td class="last odd4">&nbsp;</td>' +
                    '</tr>' +

                    '<tr class="odd1">' +
                    '<td class="first odd4">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="left">2016-01-14</td>' +
                    '<td class="nowrap odd4" align="left">Payee B</td>' +
                    '<td class="odd4" align="left">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="right">-1.025,51</td>' +
                    '<td id="selectionEnd" class="nowrap odd4" align="right">&nbsp;</td>' +
                    '<td class="last odd4">&nbsp;</td>' +
                    '</tr>' +

                    "</tbody>" +
                    "</table>" +
                    "</div>"
            );
            $(document.body).append($rootElement);
            selection = [
                $('#selectionStart').get(0),
                $('#selectionEnd').get(0)
            ];
        });

        afterEach(function () {
            rootElement.remove();
        });

        it('should extract the data and build the CSV', function () {
            console.debug();
            var csv = YNAB.extractYNABContentFromSelectedElements(selection);
            expect(csv).toEqual(header +
                    '04/01/2016,Payee A,,,,150.00\n' +
                    '14/01/2016,Payee B,,,,-1025.51\n'
            );
        });
    });


});
