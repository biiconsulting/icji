/*! ICJI - IBM Cognos JavaScript Interface
 *  Version 1.1.0
 *  
 *  Copyright (c) 2008 Chris Bennett 
 *  This work is licensed under a Creative Commons 
 *    Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
 *  http://www.creativecommons.org/licenses/by-nc-sa/3.0/
 */

/*JSLint*/
/*global ICJI*/
/*members action, addInput, addOnLoad, addParameterList, addStandardInput, all, appendChild, apply, body, buildMidTierForm, buildParaList, cgsloc, charAt, checked, cookies, cookie, count, createElement, cuCancelBtn, cuDivDisplay, cuFailMessage, cuFinishBtn, cuRunReport, cuSearch, cuSearchCookie, customFinishCode, debug, display, escape, events, fixDelim, func, get, getElementById, getElementsByName, getLocation, getParamValue, global, href, indexOf, initMidTierReport, initReport, innerHTML, isIE, join, length, location, method, objects, onload, params, paramsAll, parseDisplaySettings, preInitialize, prototype, push, reEsc, remove, removeChild, replace, rpts, search, set, setAttribute, slice, split, style, submit, substr, supplant, toGMTString, utils, value  */

/**
 * I need a remove function for arrays so I just added it to the prototype.
 * It works well, just pass it a f (from) and t (to) values or just a f value.
 */
Array.prototype.remove = function (f, t) {
    var a = this.slice((t || f) + 1 || this.length);
    this.length = f < 0 ? this.length + f : f;
    return this.push.apply(this, a);
};
/**
 * Removes empty array elements
 */
Array.prototype.clean = function() {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === null || typeof(this[i]) === undefined || this[i] === '') {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
/**
 * Removes duplicate array elements
 */
Array.prototype.unique = function () {
    var a = [];
    l : for(var i = 0; i < this.length; i++) {
        for(var j = 0; j < a.length; j++) {
            if (a[j] === this[i]) {
                this.splice(i, 1);
                i--;
                continue l;
            }
        }
        a.push(this[i]);
    }
    return this;
}
/**
 * Supplant function used from Crockfords "The Javascript 
 * Programming Language Part 3 of 4" - ~13min in
 */
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === "string" ? r : a;
        }
    );
};
/**
 * Trim function for strings
 */
String.prototype.trim = function () {
  this.replace(/^\s+/,'');
  this.replace(/\s+$/,'');
  return this;
}


/**
 * Cognos has made major changes to how objects are accessed on prompt pages
 * and there for I think it's neccessary to try to contain all the Cognos
 * specific code in one area and have all other areas access it. This will limit
 * the amount of work needed to "fix" it the next time they decide it's fun
 * to blowup customer code.
 */

if (typeof ICJI === "undefined" || !ICJI) {
    /**
     * ICJI is the global container for all the functions that have been and 
     * will be built. It functions like other OO languages namespaces.
     * If ICJI already exists, then maintain the current object. 
     */
    var ICJI = {};
}

ICJI = {
  /**
   * This returns the "G_PM..." object within the Cognos object structure. 
   *
   * w - allows you to pass the DOM object to search
   * 
   * The "m_sId" is not really likely to break - although it's ALWAYS a 
   * possibility. If it does the best place to start looking for the new name is
   * in the CCognosViewer.js file. The file is well documented and un-obfuscated
   * which again leads me to believe they are gonna keep it around for a while.
   * 
   * The "_kJ" is based on an obfuscated name and will probably break during an
   * upgrade. If/when it does search the PRMTcompiled.js for a function named:
   *   getCVInstance 
   * and a line in that function that looks like this: 
   *   var _kJ = getCVId(_kZ);
   * The "_kJ" and the "_kZ" will be different. Whatever is in in place of 
   * "_kJ" is the new obfuscated name. Use the new name here in this code.
   * 
   * TIP: Use jsbeautifier.org to beautify the PRMTcompiled code. It'll make it 
   * a heck-of-a-lot easier to read.
   */
    getGPM: function(w) { 
      if (typeof w === "undefined" || !w) {
        w = window;
      }
      var o;
      if (w['G_PM_THIS_']) {
        o = w['G_PM_THIS_'];
      } else if (w['G_PM_NS_']) {
        o = w['G_PM_NS_'];
      } else if (w['G_PM_RS']) {
        o = w['G_PM_RS_'];
      } else {
        o = w['G_PM' + this.getCognosViewerId()];
      }
      return o; //Return the object
    },
    getCognosViewerId: function () {
      // try to find the G_PM suffix.
      var s = '';
      if (window.gCognosViewer !== undefined) {
        s = '_THIS_'; // default incase the next two don't return
        if(window.gCognosViewer.m_sId !== undefined) {
            s = window.gCognosViewer.m_sId;
        } else {
            s = _kJ;
        }
      }
      return s; //Return the object
    },
    /**
     * Simply returns the parameter and value of a Report Studio named HTML 
     * object where "t" is the object html tag (ex. 'img' for image) and 
     * "n" is the name of the object used in the Miscellaneous > Name property
     * 
     * Cognos creates custom ID for each image and appends Cognos Viewer ID
     *  to the end of the name of the image.
     */
    getHtmlObject: function (t, n) {
        return $icji(t + '[LID="' + n + this.getCognosViewerId() + '"]');
    },
    /**
     * Simply returns the object
     * "f" is the name of the parameter given in the "Miscellaneous" property
     */
    getObject: function (f, w) {
        return ICJI.getGPM(w).getControlByName(f);
    }, 
    /**
     *  
     */  
    getObjectInfo: {          
        oId: function (f, w) {
            if (ICJI.isValidObject(f, w)) {
                return ICJI.getGPM(w).getControlByName(f)._id_
            } else {
                return false;
            }
        },
        oName: function(f, w) {
            var s = '';   
            if (ICJI.isValidObject(f, w)) {
                switch (ICJI.getGPM(w).getControlByName(f).n) {                
                    case 'selectValue':
                        s = 'PRMT_SV_' + this.oId(f, w);
                        break;
                    case 'textBox':
                        s = 'PRMT_TB_' + this.oId(f, w);
                        break;
                    case 'selectDate':
                        s = '_Date' + this.oId(f, w);
                        break;
                    case 'selectWithSearch':
                        s = 'PRMT_SV_' + this.oId(f, w);
                        break;
                }
            }        
            return s;
        },
        /**
         * There are instances where we are attaching
         * events to buttons. This will return the button
         * name.
         * 
         * f - name of the parameter
         * t - button type: Insert, Remove, etc
         */
        oOptlNames: function (f, t, w) {
            var s = ''; 
            if (ICJI.isValidObject(f, w)) {
                switch (t) {                
                    case 'insert':
                        s = 'PRMT_LIST_BUTTON_INSERT_' + this.oId(f, w);
                        break;
                    case 'remove':
                        s = 'PRMT_LIST_BUTTON_REMOVE_' + this.oId(f, w);
                        break;
                    case 'select':
                        s = 'PRMT_LIST_BOX_SELECT_' + this.oId(f, w);
                        break;
                    case 'date':
                        s = 'txtDate' + this.oId(f, w);
                        break;
                    case 'lldeselect':
                        s = 'PRMT_LIST_LINK_DESELECT_' + this.oId(f, w);
                        break;
                    case 'llselect':
                        s = 'PRMT_LIST_LINK_SELECT_' + this.oId(f, w);
                        break;
                    case 'radioOptions':
                        s = 'pOpt_' + this.oId(f, w);
                        break;
                    case 'sldeselect':  
                        s = 'PRMT_SV_LINK_DESELECT_' + this.oId(f, w);
                        break;
                    case 'slselect':
                        s = 'PRMT_SV_LINK_SELECT_' + this.oId(f, w);
                        break;
                    case 'inputSelectSearch':
                        s = 'swsInput' + this.oId(f, w);
                        break;
                }
            }               
            return s;
        },
        oSearchSelectObj: function (f, t, w) {
            var s = ''; 
            if (ICJI.isValidObject(f, w)) {
                switch (t) {                
                    case 'sAny':
                        s = 'swsStartAny' + this.oId(f, w);
                        break;
                    case 'sAll':
                        s = 'swsStartAll' + this.oId(f, w);
                        break;
                    case 'cAny':
                        s = 'swsMatchAny' + this.oId(f, w);
                        break;
                    case 'cAll':
                        s = 'swsMatchAll' + this.oId(f, w);
                        break;
                    case 'case':
                        s = 'swsCaseInsensitive' + this.oId(f, w);
                        break;
                }
            }
            return s;
        },           
        oParamName: function (f, w) {
            if (ICJI.isValidObject(f, w)) {
                return ICJI.getGPM(w).getControlByName(f)['@parameter'];
            } else {
                return false;
            }
        }
    },
    getButtonForFInsert: function(f, w) {
        /** This gets the F_Insert *container*
         *    -- part of the insertListValue function            
         *
         *  _c4 - contains the C_Choices object - "PRMTCompiled.js" search 
         *          for something like "new C_Choices(this);"
         */
        return ICJI.getGPM(w).getControlByName(f)._c4;
    },
    /**
     *  function to add select options
     *  
     *  v - value to be inserted
     * 
     *  s - boolean; Select and Search prompts don't have a textbox to populate
     *      so there's no need try to set the value. 
     */
    insertListValue: function (f, v, s) {            
        /** set the current value of the textbox
         *
         *  F_Insert - inserts the record from _hg (which is why you can't just 
         *          set the textbox value. C_Choices.js file
         *  
         */
        if (!s) {
            document.getElementById(ICJI.getObjectInfo.oName(f)).value = v;
        }
        var o = this.getButtonForFInsert(f);
        if (o !== null) {
            o.F_Insert();
            // F_Insert calls checkData at the end of the function so there is 
            //   no need to run the setObjectValue function.
        } else {
            this.getObject(f).checkData;
            // if o is null then it's not a multiselect prompt 
            //  and only checkData needs to be run.
        }
    },
    isValidObject: function (f, w) {
        if (ICJI.getGPM(w).getControlByName(f)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     *  Function to remove the labels on list prompts
     */
    removeListLabels: function (f, n) {
        var o = document.getElementById(ICJI.getObjectInfo.oName(f));
        if (n > 1) {
            o.removeChild(o.options[1]);
        }
        o.removeChild(o.options[0]);
        ICJI.getObject(f)._dE.removeAttribute('hasLabel');
        ICJI.setObjectValue(f);
    },
    /**
     *  Function to check or uncheck all items with Cognos' functions
     *
     *  f - name of prompt
     *  t - boolean - if true select all, false
     */
    setCheckValue: function (f, t) {
        if (t) {
            this.getObject(f).selectAll();
        } else {
            this.getObject(f).clearValues();                
        }
    },
    /**
     *  function to set the date for the Calendar UI
     *  
     *  f - name of the data parameter
     *  d - formatted data - example: new Date(MonthName+' '+day+', '+year)
     */
    setDateValue: function (f, d) {
        /** 
         * getFormatDate(d, 'YMD'); Cognos function in the CDatePickerCommon.js 
         * file and _eC is a compiled function that begins in the PRMTcompiled.js
         *
         * This'll definitely break during the next upgrade. But basically 
         * you'll be looking for a single-line function that run 
         * this._hx.setValue function where the "_hx" is also a compiled name.
         */
        if (d === '' || typeof(d) === 'undefined') {
            ICJI.getObject(f)._eC('');
        } else {
            ICJI.getObject(f)._eC(getFormatDate(d, 'YMD'));
        }
        
    },
    /**
     *  Sets the value of a Cognos Dropdown list
     *  
     *  f - name of the data parameter
     *  v - value to be searched for. it MUST be the "value" not the text
     */
    setListValue: function (f, v) {
        var o = document.getElementById(ICJI.getObjectInfo.oName(f));
        for (var i = 0; i < o.length; i++) {
            if (o[i].value === v) {
                o[i].selected = true;
                i += o.length;
            }
        }
    },        
    /**
     * Simply runs the checkData() function on any object, but you never know 
     *  when they'll change it...
     */
    setObjectValue: function (n, w) {
        return ICJI.getGPM(w).getControlByName(n).checkData();
    }
};
