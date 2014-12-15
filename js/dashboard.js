/**!
 * Created By:     Chris Bennett
 * Created On:     Nov 11, 2012
 * Last Change:    Nov 11, 2012
 *
 * This .js is intended to house all the code that's used for "dashboard" 
 * functions. I should be include in the "container" report at the which 
 * the portlet is pointed.
 *
 */

/*JSLint plusplus: true */
/*global ICJI, $icji, log
*/

ICJI.urlApi = {
    param: {
        bAction: 'b_action=',
        cvHeader: 'cv.header=',
        cvToolbar: 'cv.toolbar=',
        uiName: 'ui.name=',
        uiAction: 'ui.action=',
        uiObject: 'ui.object=',
        outputFormat: 'run.outputFormat=',
        runPrompt: 'run.prompt='
    },
    path: window.location.pathname,
    defaultFrameUri: function (rptPath, rptName) {
        var t = this.param;
        return this.path +
                '?' + t.bAction + 'cognosViewer' +
                '&' + t.uiAction + 'run' +
                '&' + t.uiObject + encodeURI(rptPath) +
                '&' + t.uiName + encodeURI(rptName) +
                '&' + t.outputFormat + // intentionally left blank
                '&' + t.runPrompt + 'false' +
                '&' + t.cvHeader + 'false' +
                '&' + t.cvToolbar + 'false';
    }
};

/**
 * Tools for cleaning (hiding) Cognos Connection UI objects
 * Some of these things can be done with just CSS - see icji-noRVheader.css
 */
ICJI.uiClean = {
    mainHeader: "mainHeader3",
    hideMainHead: function () {
        if ($icji('table[class="mainHeader3"]')) {
            $icji('table[class="mainHeader3"]')
                .next().css({"display": "none", "visibility": "hidden"});
            log.info("Hiding mainHeader3");
        }
    },
    /**
     * This was built for hiding the header that pops up when using a portlet
     * Seems pretty brittle to me - but project deadlines don't care
     * TODO: revisit this when time (or another project) permits
     */
    hidePortletHead: function () {
        if ($icji("#" + ICJI.getCognosViewerId() + "content")) {
            $icji("#" + ICJI.getCognosViewerId() +
                "content").parent().parent().prev().remove();
            log.info("Hiding Portlet Icons");
        }
    },
    /**
     * Shortcut for hiding both...
     */
    portlet: function () {
        this.hideMainHead();
        this.hidePortletHead();
    }
};

/**
 * Sets the height of the iframe that is used to display the reports.
 */
ICJI.iframe = {
    l: 0,
    t: '',
    e: '',
    h: 350,
    id: '',
    currenReport: {
        location: "",
        name: "",
        breadcrumb: "",
        useGlobalPrompts: true
    },
    breadcrumbs: function (t) {
        $icji('#icji-frame-breadcrumbs').html('<span>' + t + '</span>');
    },
    /**
     * Function to initialize the iFrame
     * @param o = takes in a JSON object with the following objects:
     *      id - id of the iframe DOM object
     *      initialReport - container for the report that will initial be run
     *          location - cognos path of the report
     *          name - Cognos name of the report
     *          breadcrumb - path of the report in the dropdown menu
     *          useGlobalPrompts - boolean indicating if the func should get
     *                  the report global prompts
     */
    build: function (o) {
        this.id = o.id;
        if (o.initialReport !== undefined) {
            this.setSource(
                o.initialReport.location,
                o.initialReport.name,
                o.initialReport.breadcrumb,
                o.initialReport.useGlobalPrompts
            );
        }
    },
    clearLoop: function () {
        clearTimeout(this.t);
        this.loading().hide();
    },
    loading: function () {
        var _doIt = function (o) {
            $icji('#icji-frameLoader').attr('class', 'icji-frameLoad' + o);
            $icji('#icji-frameGrayed').attr('class', 'icji-frameGray' + o);
            return true;
        };
        return {
            show: function () {
                return _doIt("");
            },
            hide: function () {
                return _doIt("No");
            }
        };
    },
    setHeight: function (o) {
        if (o !== undefined) {
            this.l = 0;
            this.e = o;
        }
        if (this.e.offsetTop > 0 && this.e.offsetTop === this.h) {
            $icji('#' + this.id).height((this.h + 50) + 'px');
            this.l = 99;
            this.clearLoop();
        } else {
            this.h = this.e.offsetTop;
            if (this.l < 40) {
                this.t = setTimeout(function () {
                    ICJI.iframe.setHeight();
                }, 100);
            }
        }
    },
    setSource: function (p, n, b, g) {
        this.loading().show();
        var cr = this.currenReport,
            gp = "";
        cr.location = ICJI.urlApi.defaultFrameUri(p, n);
        cr.name = n;
        cr.breadcrumb = b;
        cr.useGlobalPrompts = g;
        this.breadcrumbs(b);
        if (cr.useGlobalPrompts) {
            gp = ICJI.prompt.getPromptString();
        }
        document.getElementById(this.id).src = cr.location + gp;
        log.info('Set ' + this.id + ' Source to: ' + cr.location + gp +
            '\n    path: ' + cr.breadcrumb + '\n    name: ' + cr.name);
    }
};


/**
 * Container for prompt related functions
 */
ICJI.prompt = {
    allPrompts: [],
    applyGlobalPrompts: function () {
        ICJI.iframe.setSource(
            ICJI.iframe.currenReport.location,
            ICJI.iframe.currenReport.name,
            ICJI.iframe.currenReport.breadcrumb,
            true
        );
    },
    /**
     * hides the global prompt option window
     */
    hideGlobalPrompts: function (o, n) {
        var that = ICJI.getHtmlObject("table", n);
        if (that.is(':hidden')) {
            that.show().parent().width("225px");
            o.innerHTML = "&nbsp;&lt;&lt;&nbsp;";
            $icji(o)
                .removeClass("icji-prompt-button-open")
                .addClass("icji-prompt-button-close");
        } else {
            that.hide().parent().width("0px");
            o.innerHTML = "&nbsp;&gt;&gt;&nbsp;";
            $icji(o)
                .removeClass("icji-prompt-button-close")
                .addClass("icji-prompt-button-open");
        }
    },
    promptsArray: [],
    /**
     * returns the url api string representation of the prompts options, that
     * have been selected in the global prompts window, so they can be applied
     * to the currently loaded report or the report that will be clicked in the
     * menu list.
     */
    getPromptString: function () {
        var p,
            i;
        if (this.allPrompts.length === 0) {
            this.setAllPrompts();
        }
        this.promptsArray = [];
        for (i = 0; i < this.allPrompts.length; i++) {
            p = this.allPrompts[i];
            if (p.type === ICJI.type.SELECTSINGLE) {
                this.test.selectSingle(p);
            } else if (p.type === ICJI.type.SELECTMULTI) {
                this.test.selectMulti(p);
            } else if (p.type === ICJI.type.CHECKBOXES) {
                this.test.checkBoxes(p);
            } else if (p.type === ICJI.type.TEXTBOX) {
                /** TODO: Define this section */
            } else if (p.type === ICJI.type.SELECTDATE) {
                /** TODO: Define this section */
            }
        }
        return this.promptsArray.length > 0 ?
                "&" + this.promptsArray.join("&") : "";
    },
    test: {
        pn: function (p) { return ICJI.PARAMPREFIX + p.name + "="; },
        eC: [],
        eL: 0,
        v: "",
        pL: 0,
        pushToPA: function (o) {
            ICJI.prompt.promptsArray[ICJI.prompt.promptsArray.length] = o;
        },
        pA: this.promptsArray,
        applyEC: function () {
            if (this.eC.length > 0) {
                this.pushToPA(this.eC.join("&"));
            }
        },
        selectSingle: function (p) {
            this.v = document.getElementById(p.id);
            if (this.v !== undefined &&
                    this.v.value !== undefined &&
                    this.v.value !== "") {
                this.pushToPA(this.pn(p) + this.v.value);
            }
        },
        selectMulti: function (p) {
            var j;
            this.v = document.getElementById(p.id);
            this.eC = [];
            for (j = 0; j < this.v.length; j++) {
                if (this.v.options[j].selected) {
                    this.eC[this.eC.length] =
                        this.pn(p) + this.v.options[j].value;
                }
            }
            this.applyEC();
        },
        checkBoxes: function (p) {
            var j,
                o = $icji("input[name='" +
                        ICJI.getObjectInfo.oOptlNames(p.obj, "radioOptions") +
                        "']:checked");
            this.eC = [];
            for (j = 0; j < o.length; j++) {
                this.eC[this.eC.length] = this.pn(p) + o[j].value;
            }
            this.applyEC();
        }
    },
    /**
     * m2m = Many 2 Many (Relationship)
     * m2m provides the functionality for "cascading" prompts but handles the
     * it in multiple directions top, bottom or middle
     */
    m2m: {
        hierData: {},
        hierJson: {},
        hierParams: [],
        loc: 0,
        prefixPrmpt: "",
        prefixBlock: "",
        /**
         * build command for setting up the prompt objects on the report
         * @param opt - Options for setting up the parameters
         */
        build: function (opt) {
            log.info("Parsing Prompt Data");
            this.prefixPrmpt = opt.promptPrefix || "";
            this.prefixBlock = opt.promptBlockPrefix || "";
            var firstStep = opt.firstStep;
            // parse the initial JSON object and setup the hierarchy
            if (this.parseData()) {
                this.hierData = {};  // clean the unused object
                this.populateSelect(firstStep, this.hierJson);
            }
            this.setOnChange();
            log.info("Done Parsing Prompt Data");
        },
        clearOptions: function (s) {
            var slct = $icji('#' +
                ICJI.getObjectInfo.oName(this.prefixPrmpt + s) + " option");
            if (slct.length > 0 && slct.parent()[0].multiple) {
                slct.remove();
            } else {
                slct.slice(2).remove();
            }
        },
        parseData: function () {
            var i,
                d;
            for (i = 1; i <= this.hierData.count; i++) {
                d = this.hierData["d" + i];
                this.loc = 1;
                this.parseLevel(this.hierJson, d);
            }
            return true;
        },
        /**
         * j = JSON object to be populated
         * d = JSON object containing the level values
         *
         * This parses the list of prompt values and creates a JSON object that 
         * represents the prompt hierarchy. 
         * This function calls itself for each level.
         */
        parseLevel: function (j, d) {
            var n = this.loc,
                lvl = d["lvl" + n],
                param = this.hierParams[n] || "";
            if (!j.hasOwnProperty(lvl.code)) {
                j[lvl.code] = {};
                j[lvl.code].name = lvl.name;
                j[lvl.code].sort = lvl.sort;
                if (n !== this.hierParams.length) {
                    j[lvl.code][param] = { };
                }
            }
            if (n < this.hierParams.length) {
                this.loc = n + 1;
                this.parseLevel(
                    j[lvl.code][param],
                    d
                );
            }
        },
        /**
         * p = parameter name given in Cognos for the select object to populate
         * j = JSON object containing the data to load
         * k = key of the only value that should be populated
         *
         * Populates the select objects with the appropriate content.
         *
         */
        populateSelect: function (p, j, k) {
            var len = this.hierParams.length,
                nxtL = $icji.inArray(p, this.hierParams) + 1,
                nxtP = this.hierParams[nxtL],
                pSelect = $icji('#' +
                            ICJI.getObjectInfo.oName(this.prefixPrmpt + p));
            $icji.each(j, function (key, val) {
                if (key === k || k === undefined) {
                    if ($icji(pSelect.selector +
                            " option[value='" + key + "']").length === 0) {
                        pSelect.append(
                            $icji("<option></option>")
                                .attr("value", key)
                                .attr("sortBy", val.sort)
                                .data("prmpt-json", val)
                                .text(val.name)
                        );
                    }
                    if (nxtL < len) {
                        ICJI.prompt.m2m.populateSelect(nxtP, val[nxtP]);
                    }
                }
            });
            this.sortSelect(pSelect);
            if (!pSelect[0].multiple) {
                pSelect[0].selectedIndex = 0;
            }
        },
        /**
         * function that runs when a select option item is selected
         */
        promptChange: function (e) {
            var idx = $icji(e)[0].selectedIndex,
                len = this.hierParams.length,
                // current select level data
                cPrm = $icji(e).attr("icji-param-name"),
                cLvl = $icji.inArray(cPrm, this.hierParams),
                cJson = $icji("#" +
                    ICJI.getObjectInfo.oName(
                        ICJI.prompt.m2m.prefixPrmpt + cPrm
                    ) +
                    " option:selected").data("prmpt-json"),
                // next select level down data
                nLvl = cLvl + 1,
                nPrm = this.hierParams[nLvl],
                i,
                pJson;
            for (i = nLvl; i < len; i++) {
                this.clearOptions(this.hierParams[i]);
            }
            if (idx === 0 || idx === 1) {
                if (cLvl === 0) {
                    this.populateSelect(cPrm, this.hierJson);
                } else if (cLvl !== len) {
                    // previous select level up data
                    pJson = $icji("#" + ICJI.getObjectInfo.oName(
                        ICJI.prompt.m2m.prefixPrmpt +
                            this.hierParams[cLvl - 1]
                    ) + " option:selected").data("prmpt-json");
                    this.populateSelect(cPrm, pJson[cPrm]);
                }
            } else {
                this.populateSelect(nPrm, cJson[nPrm]);
            }
        },
        setOnChange: function () {
            $icji.each(this.hierParams, function (i, v) {
                $icji("#" + ICJI.getObjectInfo.oName(
                    ICJI.prompt.m2m.prefixPrmpt + v
                ))
                    .attr("icji-param-name", v)
                    .change(function () {
                        ICJI.prompt.m2m.promptChange(this);
                    });
            });
        },
        /**
         * Sorts the select options prompt object.
         */
        sortSelect: function (s) {
            $icji(s.selector + " option")
                .sort(this.doSort)
                .appendTo(s.selector);
        },
        /**
         * Sort function - based on standard sort function but used to sort 
         * on a custom sort attribute.
         */
        doSort: function (a, b) {
            a = a.getAttribute("sortBy");
            b = b.getAttribute("sortBy");
            return a > b ? 1 : (a < b ? -1 : 0);
        }
    },
    /**
     * Clears the onclick function of the button and then adds the
     * Apply Global Prompts function to the button.
     * @param n - name of the DIV that contains the button
     */
    overrideButtonClick: function (n) {
        var o = ICJI.getHtmlObject("div",
            ICJI.prompt.m2m.prefixBlock + n).find(":button");
        log.trace("overrideButtonClick: name - " + n);
        log.trace("                     length - " + o.length);
        log.trace("                     selector - " + o.selector);
        if (o.length !== 0) {
            o.attr("onclick", "")
                .click(function () {
                    ICJI.prompt.applyGlobalPrompts();
                });
        }
    },
    /**
     * Search for all global prompts and store their info in the allPrompts
     * parameter for use by other functions
     */
    setAllPrompts: function () {
        var params = ICJI.getAllParameterNames(),
            i;
        this.allPrompts = [];
        this.allPrompts.length = params.length;
        for (i = 0; i < params.length; i++) {
            this.allPrompts[i] = {
                obj: params[i],
                id: ICJI.getObjectInfo.oName(params[i]),
                name: ICJI.getObjectInfo.oParamName(params[i]),
                type: ICJI.getObjectInfo.oType(params[i])
            };
        }
    }
};

ICJI.menubar = {
};








/**
 * ToDo:  Fix all this stuff...
 */

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === "string" || typeof r === 'number' ? r : a;
        }
        );
};

function resetMenu(s) {
    $icji("#menuRptType").val(s);
    $icji('#mainMenu_table > tbody:first > tr').empty();
}

function parseMenuData(s) {

    log.debug('Begin parsing menu content');

    var t, l1 = 0, l2 = 1, mItm, mRpt, mSrc, mSec, mRnm, liID, p;
    var isRebuild = s === undefined ? false : true;
    var curSecCd = s === undefined ? $icji('#secCode').val() : s;
    var isEnt = s !== undefined && $icji('#secCode').val() === 'E' ? true : false;
    var e = document.getElementById('menuData'); // list of menu items

    var menuMain =
        '<td><a onmouseover=\'xpshow("m{pL1}s{pL2}",0,this);xpsmover(this);\' ' +
        'onmouseout=\'xpsmout(this);\'>{pMItm}</a><div><ul id="vbUL_m{pL1}s{pL2}"' +
        ' class="subMenu"></ul></div></td>';

    var menuMainEmpty =
        '<td><a onmouseover=\'xpshow("m{pL1}s{pL2}",0,this);xpsmover(this);\' ' +
        'onmouseout=\'xpsmout(this);\'>{pMItm}</a></td>';

    var menuMainId = 'vbUL_m{pL1}s{pL2}'

    var menuItem =
        '<li><a href="javascript:ICJI.iframe.setSource(\'{pMSrc}\', \'{pMRnm}\', \'{pMItm}\' + \' > \' + \'{pMRpt}\', true);">' +
        '{pMRpt}</a></li>';

    var menuItemGray = '<li><a style="color: BBBBBB;">{pMRpt}</a></li>';

    log.info('Length: ' + e.childNodes.length);

    for (var i = 0; i < e.childNodes.length; i++) {

        t = e.childNodes[i].innerHTML;

        if (t !== undefined && t.indexOf('BU') !== -1) {

            mRpt = t.split('::')[2].replace(/'/g, "\\\'");
            mSrc = t.split('::')[3].replace(/'/g, "\\\'");
            mSec = t.split('::')[4];
            mRnm = t.split('::')[5].replace(/'/g, "\\\'");

            log.info('mRpt:'+mRpt+'  mSrc:'+mSrc+'  mSec:'+mSec+'  mRnm:'+mRnm);

            if (mItm !== t.split('::')[1]) {

                mItm = t.split('::')[1];

                ++l1;

                p = {pL1: l1, pL2: l2, pMItm: mItm, pMRpt: mRpt, pMSrc: mSrc, pMSec: mSec, pMRnm: mRnm};

                if (t.split('::')[2] !== ' '
                    && t.split('::')[2] !== ''
                    && t.split('::')[2] !== undefined) {

                    $icji('#mainMenu_table > tbody:first > tr')
                        .append(menuMain.supplant(p));

                    if (curSecCd === 'E' || mSec === 'E' || curSecCd === mSec) {
                        $icji('#' + menuMainId.supplant(p)).empty();
                        $icji('#' + menuMainId.supplant(p)).append(menuItem.supplant(p));
                    } else if (isEnt) {
                        $icji('#' + menuMainId.supplant(p)).append(menuItemGray.supplant(p));

                    }

                } else {
                    // insert and empty menu item
                    $icji('#mainMenu_table > tbody:first > tr')
                        .append(menuMainEmpty.supplant(p));
                }
                
            } else if (mItm === t.split('::')[1]) {

                if (t.split('::')[2] !== '' || t.split('::')[2] !== undefined) {

                    p = {pL1: l1, pL2: l2, pMItm: mItm, pMRpt: mRpt, pMSrc: mSrc, pMSec: mSec, pMRnm: mRnm};

                    if (curSecCd === 'E' || mSec === 'E' || curSecCd === mSec) {
                        $icji('#' + menuMainId.supplant(p)).append(menuItem.supplant(p));
                    } else if (isEnt) {
                        $icji('#' + menuMainId.supplant(p)).append(menuItemGray.supplant(p));
                    }
                }
            }
        }
    }
    
    //rebuild the dropdowns
    if (isRebuild) {
        $icji('#xpMenuCont').empty()
        log.info('Completed Rebuild');
        vistaButtons({ subFrame: 0 }, true);
    }
    
    log.debug('End parsing menu content');
    
}












