describe("YNAB", function () {

    describe("CSV builder", function () {
        var header = 'Date,Payee,Category,Memo,Outflow,Inflow\n';

        it("should build empty csv if there is no data", function () {
            var csv = YnabCsvGenerator.buildYnabCsv([], {});
            expect(csv).toEqual(header);
        });

        it("should build csv", function () {
            var csv = YnabCsvGenerator.buildYnabCsv([
                ['1000', 'Payee A', '2015/01/01'],
                ['-1000', 'Payee B', '2015/01/02']
            ], {inflow:0, payee:1, date: 2});
            expect(csv).toEqual(header +
                '01/01/2015,Payee A,,,,1000.00\n' +
                '02/01/2015,Payee B,,,,-1000.00\n'
            );
        });

        it("should ignore empty lines", function () {
            var csv = YnabCsvGenerator.buildYnabCsv([
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
                    '<td id="selectionStart" class="nowrap odd4" align="left">Payee A,A</td>' +
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
            var csv = YnabCsvGenerator.extractYNABContentFromSelectedElements(selection);
            expect(csv).toEqual(header +
                    '04/01/2016,Payee A;A,,,,150.00\n' +
                    '14/01/2016,Payee B,,,,-1025.51\n'
            );
        });
    });


});
