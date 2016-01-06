describe("YNAB", function () {
    describe("extract redirection", function () {
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


    describe("Header Finder", function () {
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

        it("should find Nordea header", function () {
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
});
