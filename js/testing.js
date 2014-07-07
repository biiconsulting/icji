/**
 * Created by chris.bennett on 9/14/13.
 */

var log, ICJI, $icji;

//$icji(document).ready(
function addTableSorter() {
    log.debug('Begin preping List for tablesorter.');

    var tNm = 'table[LID="ProductSalesReport' + ICJI.getCognosViewerId() + '"]',
        thisTable = $icji(tNm);

    log.trace("tNm = " + tNm);

    if ($icji(tNm + ' thead').length === 0) {
        thisTable.prepend(
            $icji('<thead></thead>')
                .append($icji(tNm + ' tr:first').remove())
        );
        $icji(tNm + ' thead')
            .html(function () {
                var s = $icji(this).html();
                log.trace('this.html: ' + s);
                return s.replace(/<td/gi, '<th').replace(/td>/gi, 'th>');
            });
    }

    if ($icji(tNm + ' tfoot').length === 0) {
        thisTable.append(  // Only needed if there is a footer - ie. Total Line
            $icji('<tfoot></tfoot>')
                .append($icji(tNm + ' tr:last').remove())
        );
    }

//    $icji(tNm + ' thead tr td').removeClass().removeAttr('type');
//    $icji(tNm + ' tbody tr td').removeClass().removeAttr('type');

    log.debug('Completed preping List for tablesorter.');
    $icji(tNm).tablesorter({debug: true,
        // define a custom text extraction function
        textExtraction: function (node) {
            // extract data from markup and return it
            var t = '',
                n = node;
            while (n.childNodes.length > 0) {
                t = $icji(n).text() + $icji(n).siblings().text();
                n = n.childNodes[0];
            }
            return t;
        }
        });

    log.debug('Completed setting tablesorter against - ' + tNm);
}

//);
