/**
 * Created by chris.bennett on 9/26/13.
 */

var $icji;

var statusIsUpdating = true;

function doPrgUpdate() {
    updPrgGetStatus();
    if (statusIsUpdating) {
        setTimeout("doPrgUpdate()", 50);
    } else {
        $icji("#dialogProgressbar")
            .dialog({
                buttons: { "Close": function () { $icji(this).dialog("close"); } },
                title: "Successfully logged on to both environments."
            })
            .scrollTop($icji("#dialogProgressbar")[0].scrollHeight);
    }
}

function updPrgActiveStatus() {
    AddoHoldings.BIMigration.CurrentProgress.SetStatusIsUpdating(true);
}

function updPrgSuccess(result, eventArgs) {
    $icji("#progressbar")
        .html(result)
        .scrollTop($icji("#dialogProgressbar")[0].scrollHeight);
}

function updPrgFailure(error) {// Display the error.
    document.getElementById('updateMyProgress').innerHTML =
        "Service Error: " + error.get_message();
}

function updPrgGetStatus() {
    AddoHoldings.BIMigration.CurrentProgress.GetStatus(
        updPrgSuccess,
        updPrgFailure
    );
}

function updPrgGetStatusIsUpdating() {
    AddoHoldings.BIMigration.CurrentProgress.GetStatusIsUpdating(
        function (b) { statusIsUpdating = b; },
        function (b) { statusIsUpdating = false; }
    );
}
