#ICJI - IBM Cognos JavaScript Interface


Copyright (c) 2008 - 2014 Chris Bennett 

This work is licensed under a Creative Commons 
  Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
http://www.creativecommons.org/licenses/by-nc-sa/3.0/


###Version Information

IBM Cognos obfuscates some of it's JavaScript code. As such you mush use the correct
version of ICJI for the version of IBM Cognos you have.  Below is a reference 
for version capatability.

	ICJI Version				IBM Cognos Version
	1.0.0 ................................. 8.4.1
	1.1.0 ................................. Not Yet Tested
	1.2.0 ................................. 10.1.1 
	1.3.0 ................................. 10.2 GA
	1.3.2 ................................. 10.2.1 GA       (10.2.5000.275-0)
	1.3.3 ................................. 10.2.1 FP1      (10.2.5001.156-0)
	                                        10.2.1 FP1 IF3  (10.2.5001.1516-0)

###Quick Start:

[Download the ICJI repository](https://github.com/addoholdings/icji/downloads) 
and save the .zip or .tar.gz file. Decompress the 
file and you will see two directories along with other files and directories. 
These two are the only directories that you need to be concerned with.

Move or Save the "js" and "css" directories into the "webcontent" directory 
on the Cognos Gateway server. I usually put then in a new directory under 
the skins directory in webcontent. 
example. install_dir/webcontent/skins/icji

If your environment has more than one Gateway server, the files have to be on 
all Gateways, in the same directory.

After the files are on the Gateway(s) you're ready to build a report with the 
code. Open a Report Studio report and add the following code to an HTML Item 
at the top of the Prompt Page or Report Page you want to modify.

```html
<script type="text/javascript" src="/ibmcognos/...storage_directory/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="/ibmcognos/...storage_directory/log4javascript.js"></script>
<script type="text/javascript" src="/ibmcognos/...storage_directory/icji-1.1.0.min.js"></script>

<script>
  var $icji = jQuery.noConflict(true);
  var log = log4javascript.getDefaultLogger();
  log.setLevel(log4javascript.Level.ALL);
  log4javascript.setEnabled(false); // If you want JS logging to run, comment this line.
  log.trace("This is a debugging message from the log4javascript in-page page");
</script>
```

That's it, you're ready to start coding...


###Samples:

At some point in the near future I'll build some samples. But, right now I 
haven't told anyone this is available so I'm assuming no one except me 
needs to know how to use it... :)


###Overview and History:

This .js is intended to provide some basic JavaScript functions for use in 
IBM Cognos HTML based reports. When Cognos (not owned by IBM at the time) came 
out with ReportNet it geared the report building toward browser base delivery
of reports. As part of that push to deliver HTML reports, a feature was add 
called the "HTML Item." This feature provided a way to embed HTML directly into
the Report that was generate allowing the developer to access and modify the 
generated report after it was delivered to the browser. This of course included
embedded JavaScript code.

One of the primary uses we developers used this new feature for was to 
supplement the capabilities of the out-of-the-box Cognos Report Studio. Things
that we thought should have been available were not. Things like setting the 
default search options for a Search and Select prompt - not available... 
However embedding some JavaScript into the report via an HTML Item allowed 
for modifying the report after the page loaded. 

The primary object that has been used to this point to access the Cognos objects
in the browser up to this point has been the infamous "formWarpRequest". This 
form element contained all the elements that up would normally want to access. 
However Cognos has a tendency to change the function of some of the object and 
sometimes removes functionality altogether. For those of us that have been 
around long enough, to experience the pain of upgrading a boat load of reports 
that need to have there embedded and heavily duplicated JavaScript fixed 
as a result of these changes, it's easy to understand why you would want a way 
to isolate those potential problem.

As a consultant, I've spent many hours at dozens of client sights being paid 
to do nothing but fix broken JavaScript code during system upgraded. Thus was 
the birth of ICJI. It started out about 4 years ago as a hodge podge of code 
from dozens of experiences all in random .js files. As the years progressed 
and my understanding of JavaScript deepened it morphed in to what it is today.
Now, it's grown to the point that I feel it's time to start officially 
tracking the changes I'm making. Because this code, in one name or another, 
has been used at so many client sites, there will come a time when they'll 
need to upgrade it to some new version of Cognos. When that time comes I want
to be able to make good on my promise of making their upgrade as seamless as
possible. ...at least from the perspective of the code I've written for them. 
I make no promises for other peoples code! :)

###[Issues:](https://github.com/addoholdings/icji/issues) 
When you find an issue or you have a problem with the code or you'd like to request 
and enhancement to the code, you are more that welcome to use the 
[issues tool](https://github.com/addoholdings/icji/issues) that GitHub provides.

As a consultant I always assume that the code I write will eventually be modified, 
updated, etc. If you are using this code and have questions, have 
a more efficient way to do something, etc. and are feeling generous, let me 
know your thoughts: chris.bennett@addoholdings.com or contact me through 
my GitHub account:  https://github.com/addoholdings

###About Me:

I've been a Cognos consultant since 1999. I've done just about everything I can
think of related to Cognos BI and related technologies - DB Architecture, ETL, 
Cognos Admin, Modeling, Development, web/web services development.  

Thanks!



