describe("Itau", function () {
    describe("Extract Content", function () {
        var header = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
        var $rootElement;
        var selection;

        beforeEach(function () {
            $rootElement = $(HTML_ITAU);
            $(document.body).append($rootElement);
            selection = [
                $('.selectionStart').get(0),
                $('.selectionEnd').get(0)
            ];
        });

        afterEach(function () {
            $rootElement.remove();
        });

        it('should extract the data and build the CSV', function () {
            var csv = YNAB.extractYNABContentFromSelectedElements(selection);
            expect(csv).toEqual(header +
                                '01/03/2016,TBI 2743.32342-6/500,,,,920.00\n' +
                                '02/03/2016,TBI 8062.09114-8HaiThai,,,,58.64\n'
            );
        });

        it('should identify negative values', function () {
            pending('Negative sign is on a separated column...');
            var csv = YNAB.extractYNABContentFromSelectedElements(selection);
            expect(csv).toEqual(header +
                                '01/03/2016,TBI 2743.32342-6/500,,,,-920.00\n' +
                                '02/03/2016,TBI 8062.09114-8HaiThai,,,,-58.64\n'
            );
        });
    });
});

var HTML_ITAU = '\
<table>\
<tr>\
	<td colspan="9" id="linha10">\
        <table style="width:100%;" border="0" cellspacing="0" cellpadding="0">\
        <tbody>\
        <tr class="EXTboxTit">\
            <td class="EXTlinhaBold" style="width:8%;text-align:left;border-width: 0px;">Data</td>\
            <td class="EXTlinhaBold" style="width:2%;text-align:left;border-width: 0px;"></td>\
            <td class="EXTlinhaBold" style="width:2%;text-align:left;border-width: 0px;"></td>\
            <td class="EXTlinhaBold" style="width:35%;text-align:left;border-width: 0px;">Lançamento</td>\
            <td class="EXTlinhaBold" style="width:20%;text-align:right;border-width: 0px;">Ag/Origem</td>\
            <td class="EXTlinhaBold" style="width:16%;text-align:right;border-width: 0px;">Valor (R$)</td>\
            <td class="EXTlinhaBold" style="width:1%;text-align:right;border-width: 0px;">&nbsp;</td>\
            <td class="EXTlinhaBold" style="width:15%;text-align:right;border-width: 0px;" align="right">Saldo (R$)</td>\
            <td class="EXTlinhaBold" style="width:1%;text-align:left;border-width: 0px;">&nbsp;</td>\
        </tr>\
        </tbody>\
        </table>\
	</td>\
</tr>\
<tr height="22px" name="NaoDocTed">\
	<td class="EXTlinhaPar selectionStart" id="date10">01/03</td>\
	<td class="EXTlinhaPar"> </td>\
	<td class="EXTlinhaPar"></td>\
	<td nowrap="true" class="EXTlinhaPar">TBI 2743.32342-6/500 &nbsp;   &nbsp;   &nbsp; <img id="AjudaExtrato" name="AjudaExtrato" src="/V1/ITAUF/IMG/Cheque_Extrato.png" onclick="javascript:ExibirCheques(\'38200203720020160301\');" style="vertical-align:middle;visibility:hidden;cursor:pointer;" title="Visualizar cheque compensado."><img name="ExibeDetalhe" src="/V1/PERS/IMG/icone_person_imersao.png" style="visibility: hidden; position: relative; top: 2px;" title="Transferência entre contas Itaú realizada via internet."><img name="divdocted" src="/V1/PERS/IMG/detalhes_extrato.png" valorteddoc="92000" datateddoc="01/03/2016" style="display:;vertical-align:middle;visibility:hidden;cursor:pointer;" title="Consultar DOC e TED recebido"></td>\
	<td align="right" class="EXTlinhaPar"></td>\
	<td align="right" class="EXTlinhaParNeg">920,00</td>\
	<td align="right" class="EXTlinhaParNeg">-</td>\
	<td align="right" class="EXTlinhaParNeg"> </td>\
	<td class="EXTlinhaParNeg"></td>\
</tr>\
<tr style="display:none" id="exibe11">\
	<td colspan="9">\
	    <table style="width:100%;" border="0" cellspacing="0" cellpadding="0">\
		<tbody>\
		<tr>\
		<td class="EXTbordaBottom">&nbsp;</td>\
		</tr>\
        <tr>\
		<td class="EXTlinhaBold2" nowrap="true" colspan="2" id="header11"></td>\
		</tr>\
	    </tbody></table>\
	</td>\
</tr>\
<tr>\
	<td colspan="9" id="linha11"></td>\
</tr>\
<tr height="22px" name="NaoDocTed">\
	<td class="EXTlinhaImpar" id="date11">02/03</td>\
	<td class="EXTlinhaImpar"> </td>\
	<td class="EXTlinhaImpar"></td>\
	<td nowrap="true" class="EXTlinhaImpar">TBI 8062.09114-8HaiThai &nbsp;   &nbsp;   &nbsp; <img id="AjudaExtrato" name="AjudaExtrato" src="/V1/ITAUF/IMG/Cheque_Extrato.png" onclick="javascript:ExibirCheques(\'3820020372iThai20160301\');" style="vertical-align:middle;visibility:hidden;cursor:pointer;" title="Visualizar cheque compensado."><img name="ExibeDetalhe" src="/V1/PERS/IMG/icone_person_imersao.png" style="visibility: hidden; position: relative; top: 2px;" title="Transferência entre contas Itaú realizada via internet."><img name="divdocted" src="/V1/PERS/IMG/detalhes_extrato.png" valorteddoc="5864" datateddoc="01/03/2016" style="display:;vertical-align:middle;visibility:hidden;cursor:pointer;" title="Consultar DOC e TED recebido"></td>\
	<td align="right" class="EXTlinhaImpar"></td>\
	<td align="right" class="EXTlinhaImparNeg">58,64</td>\
	<td align="right" class="EXTlinhaImparNeg selectionEnd">-</td>\
	<td align="right" class="EXTlinhaImparNeg"> </td>\
	<td class="EXTlinhaImparNeg"></td>\
</tr>\
</table>';
