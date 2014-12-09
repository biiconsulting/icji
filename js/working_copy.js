/*JSLint plusplus: true */
/*global ICJI, $icji, log4javascript
 */

var log = log4javascript.getDefaultLogger();
log.setLevel(log4javascript.Level.ALL);
//log4javascript.setEnabled(false); // If you want JS logging to run, comment this line.
log.trace("This is a debugging message from the log4javascript in-page page");

ICJI.uiClean.portlet();             // Hide Headers
ICJI.prompt.m2m.build({             // Setup Global Prompt objects
    "promptPrefix" : "po_",
    "promptBlockPrefix" : "pb_",
    "firstStep" : "p_country"
});
ICJI.iframe.build({                 // Initial frame load
    "id" : "icji-iframeContent",
    "initialReport" : {
        "location" : "/content/folder[@name='Development']/folder[@name='Chris']/folder[@name='SBP Prototype']/report[@name='SLS001 - Sales Volume/Revenue Trend']",
        "name" : "SLS001 - Sales Volume/Revenue Trend",
        "breadcrumb" : "Sales > Sales Trend",
        "useGlobalPrompts" : true
    }
});



/**
     * Build menu in table in preparation for running the Vista Buttons stuff
     */
parseMenuData();

    /**
     * Load Vista Buttons JS
     * TODO: I have GOT to rebuild this awful Menu code...
     */
log.info('Load dropdownmenu.js');
$icji.getScript('/cognos/skins/greif/icji/js/dropdownmenu.js')
.done( function() {
    log.debug('Succesfully loaded dropdownmenu.js');
    vistaButtons({ subFrame: 0 }); }
)
.fail( function() {
    log.debug('Failed to load script.'); }
);
log.debug('Completed vistaButton Build');



    /**
     * Initial frame load
     */
ICJI.iframe.id = 'icji-iframeContent';
ICJI.iframe.setSource("/content/folder[@name='Development']/folder[@name='Chris']/folder[@name='SBP Prototype']/report[@name='SLS001 - Sales Volume/Revenue Trend']","SLS001 - Sales Volume/Revenue Trend","Sales > Sales Trend");



// Animate the button movement
$icji('#menuMoveRight')
    // click the botton to move to the end of the list quickly
    .click(function () {
        $icji('#mainMenu_table').stop();
        var w = $icji("#mainMenu_table").width() - 887;
        w = w > 0 ? ((w + 25) * -1) : 0;
        $icji('#mainMenu_table').animate({ left: w + 'px' }, 500);
    })
    // hover over the button to mover the list more slowly
    .mouseover(function () {
        var w = $icji("#mainMenu_table").width() - 887;
        w = w > 0 ? ((w + 25) * -1) : 0;
        $icji('#mainMenu_table').animate({ left: w + 'px' }, 3000);
    })
    // move the mouse from over the button to stop the animation
    .mouseout(function () {
        $icji('#mainMenu_table').stop(); }
    );

// Left side button - work the same as the right side in reverse
$icji('#menuMoveLeft')
    .click(function () {
        $icji('#mainMenu_table').stop();
        $icji('#mainMenu_table').animate({ left: '0px' }, 500);
    })
    .mouseover(function () {
        $icji('#mainMenu_table').animate({ left: '0px' }, 3000);
    })
    .mouseout(function () {
        $icji('#mainMenu_table').stop();
    });
