describe("YNAB", function () {
    describe("Extract Redirection", function () {
        beforeEach(function () {
            spyOn(YNAB, "extractYNABContentFromTextAndElement");
            spyOn(YNAB, "extractYNABContentFromText");
            spyOn(YNAB, "extractYNABContentFromElement");
        });

        it("should redirect the call if both arguments are passed", function () {
            YNAB.extractYNABContent("aaaa", {id: "aaa"});
            expect(YNAB.extractYNABContentFromTextAndElement).toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromText).not.toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromElement).not.toHaveBeenCalled();
        });

        it("should redirect the call if only the selectionText is passed", function () {
            YNAB.extractYNABContent("aaaa", undefined);
            expect(YNAB.extractYNABContentFromTextAndElement).not.toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromText).toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromElement).not.toHaveBeenCalled();
        });

        it("should redirect the call if only the selectionElement passed", function () {
            YNAB.extractYNABContent(null, {id: "aaa"});
            expect(YNAB.extractYNABContentFromTextAndElement).not.toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromText).not.toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromElement).toHaveBeenCalled();
        });

        it("should return empty string if no arguments are passed", function () {
            expect(YNAB.extractYNABContent(undefined, null)).toBe("");
            expect(YNAB.extractYNABContentFromTextAndElement).not.toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromText).not.toHaveBeenCalled();
            expect(YNAB.extractYNABContentFromElement).not.toHaveBeenCalled();
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
                '2015/01/01,Payee A,,,,1000\n' +
                '2015/01/02,Payee B,,,,-1000\n'
            );
        });

    });

    describe("Extract Content", function () {
        var header = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
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

                    '<tr class="even">' +
                    '<td class="first odd4">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="left">2016-01-04</td>' +
                    '<td class="nowrap odd4" align="left">Payee A</td>' +
                    '<td class="odd4" align="left">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="right">150,00</td>' +
                    '<td class="nowrap odd4" align="right">&nbsp;</td>' +
                    '<td class="last odd4">&nbsp;</td>' +
                    '</tr>' +

                    '<tr class="odd1">' +
                    '<td class="first odd4">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="left">2016-01-04</td>' +
                    '<td class="nowrap odd4" align="left">Payee B</td>' +
                    '<td class="odd4" align="left">&nbsp;</td>' +
                    '<td class="nowrap odd4" align="right">-1.025,51</td>' +
                    '<td class="nowrap odd4" align="right">&nbsp;</td>' +
                    '<td class="last odd4">&nbsp;</td>' +
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

        it('should extract the data and build the CSV', function () {
            var selectionText = ' 	2016-01-04	Reservation Kortköp AKERSBERGA 1283	 	-150,00	 	 \n' +
                ' 	2016-01-04	Reservation Kortköp ICA KVANTUM AKERSB	 	-1.025,51	 	 ';
            var csv = YNAB.extractYNABContentFromTextAndElement(selectionText, clickedElement);
            expect(csv).toEqual(header +
                    '2016-01-04,Reservation Kortköp AKERSBERGA 1283,,,,-150,00\n' +
                    '2016-01-04,Reservation Kortköp ICA KVANTUM AKERSB,,,,-1.025,51\n'
            );
        });
    });


});
