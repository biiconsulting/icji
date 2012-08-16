ICJI - Cognos Connection JavaScript Interface
Version 1.1.0
 

Copyright (c) 2008 Chris Bennett 
This work is licensed under a Creative Commons 
  Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://www.creativecommons.org/licenses/by-nc-sa/3.0/


Quick Start:

Save the files into the "webcontent" directory on the Cognos Gateway server. I 
usually put then in a new directory under the skins directory in webcontent. 
ie. install_dir/webcontent/skins/addoholdings

If your environment has more than one Gateway server, the files have to be on 
all Gateways, in the same directory.

After the files are on the Gateway(s) 


Overview and History:

This .js is intended to provide some basic JavaScript functions for use in 
IBM Cognos HTML based reports. When Cognos (not owned by IBM at the time) came 
out with ReportNet it geared the report building toward browser base delievery
of reports. As part of that push to deliever HTML reports, a feature was add 
called the "HTML Item." This feature provided a way to embed HTML directly into
the Report that was generate allowing the developer to access and modify the 
generated report after it was delivered to the browser. This of course included
embedded JavaScript code.

One of the primary uses we developers used this new feature for was to 
supplement the capabilities of the out-of-the-box Cognos Report Studio. Things
that we thought should have been available were not. Things like setting the 
default search options for a Search and Select prompt - not available... 
However embedding some JavaScript into the report via an HTML Item allowed 
for modifing the report after the page loaded. 

The primary object that has been used to this point to access the Cognos objects
in the browser up to this point has been the infamous "formWarpRequest". This 
form element contained all the 


I'm a consultant and as such always assume that code will be modified, updated, 
etc. If you are editing this code and have questions, find mistakes, have a more 
efficient way to do something, etc. and are feeling generous, let me know 
your thoughts: chris.bennett@addoholdings.com or contact me through my github 
account:  https://github.com/meoutside




This particualar version of this file has been built to run with 
Cognos v8.4.1 It is untested on previous and future versions.



Thanks!

On to the code...

Where applicable, I've done my best to explain the code. Where I think it's 
obvious I leave it alone. The comments have a tendency to make the 
code quite large. Therefor, all my .js files get run through JSMin prior to 
being placed in production.

If you don't know about JSMin, then check this out:
    http://javascript.crockford.com
When it comes to JavaScript, IMHO, there is no one better to look to than 
Douglas Crockford. So read up and code better...




Old Modification History:  (didn't want to just ditch it...)

Name               Date        Modification  
-----------------  ----------  ----------------------------------------------
Chris Bennett      2012-04-05 
   - Created ICJI.Cognos.getGPM function
   - Created ICJI.Cognos.getHtmlObject function
   - Created ICJI.Cognos.getCognosViewerId function
   - Removed ..isIE function - incorporating jQuery now - they have a much 
         robust function for finding the browser type
Chris Bennett      2012-04-10  
   - Removed the ".Cognos" layer - seems redundant
   - Removed redundant code from getGPM (same as getCognosViewerId)
Chris Bennett      2012-04-12  
   - Changed the behavior of the getGPM to test for possible options before
     running the getCognosViewerId function
Chris Bennett      2012-05-02
   - Added "w" parameter to getGPM to allow for passing a specific DOM 
     hierarchy to the function. "w" was also added to multiple other 
     functions to pass the value.

============================================================================= 
