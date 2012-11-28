#ICJI - IBM Cognos JavaScript Interface


###About the Code:

This particualar version of this file has been built to run with Cognos v10.1.1. 
Parts of the code were build originally with Cognos 8.4.1 and have been run and 
tested with that version.  However not all the code has been tested with that 
version.

Where applicable, I've done my best to explain the code. Where I think it's 
obvious I leave it alone. The comments have a tendency to make the 
code quite large. Therefor, all my .js files get run through JSMin prior to 
being placed in production. So remember to use the .min.js versions.


###Tested versions

List of IBM Cognos BI versions it's been tested against. See "Version" section of 
the README for more information.

ICJI v1.0 - IBM Cognos BI v8.4.1
ICJI v1.1 - 
ICJI v1.2 - IBM Cognos BI v10.1.1
ICJI v1.3 - IBM Cognos BI v10.2

###Release Notes

#####Modifications - 2012-11-28:

- Added Sub-Versions of the code that correspond to IBM Cognos versions (See new README Version section).
- Created v1.3 and updated code to be compatible with IBM Cognos 10.2.
- Added a "toInt" function to the Array prototype.
- getButtonForFInsert - created test for call to PRMTCompiled.js and prmt_core.js
- Deprecated removeListLabels from both v1.2 and v1.3.
- setDateValue - created test for call to PRMTCompiled.js and prmt_core.js
- Added a "utils" object to the ICJI code that includes date manipulate objects.
- Updated README.

Version 1.3
- getGPM - the "G_PM" object no longer exists in Cognos 10.2 - this was converted to use the "cognos.Report.getReport().prompt" object
- Consolidated all getGPM(w).getControlByName(f) to getObject(f, w) calls.

#####Modifications - 2012-08-14:

- Initial release to github.com
- Addition of readme.md
- addition of release-notes.md

###A few Pre-GitHub Notes

(didn't want to just ditch them...)

#####Modifications - 2012-05-02
- Added "w" parameter to getGPM to allow for passing a specific DOM 
     hierarchy to the function. "w" was also added to multiple other 
     functions to pass the value.

#####Modifications - 2012-04-12  
- Changed the behavior of the getGPM to test for possible options before
     running the getCognosViewerId function

#####Modifications - 2012-04-10  
- Removed the ".Cognos" layer - seems redundant
- Removed redundant code from getGPM (same as getCognosViewerId)

#####Modifications - 2012-04-05 
- Created ICJI.Cognos.getGPM function
- Created ICJI.Cognos.getHtmlObject function
- Created ICJI.Cognos.getCognosViewerId function
- Removed ..isIE function - incorporating jQuery now - they have a much 
  robust function for finding the browser type
