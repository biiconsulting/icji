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

List of IBM Cognos BI versions it's been tested against.


- 10.1.1


###Release Notes

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
