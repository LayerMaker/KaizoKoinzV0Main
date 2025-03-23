Styling issues throughout the project and their fixes. 

Styling issues// 
The emulator had previous styling issues, this was in all instances, from test files through to production files.

Fixed by Div Container//
To solve the styling issue we placed the emulator file in a Div. This gave us the correct styling. The styling was taken from a clone site that also had an emulator with a rom loading into it. This allowed the emulators controls to be styled within the emulator container as expected and observed and match the clone site. 

What it fixedd//
The results that we were getting before it was placed into a div to resemble the clone site, the issues were the emulators controls were outside of the emlator container and they were acting like footers at the bottom of the webpage. This took a while to identify and many hours and sessions to fix.

Fixed-Div container hosting he emulator//
for overview, the the main site was not connecting to the rom that was loading from the server, therefore the rom would not load. To debug and troubleshoot this issue we created a test file that was just a stand alone emulator saved as a html file. This file was then loaded with the rom from the server and it loaded with no issues. (this had the wallet feature disabled to test the rom loading, there were a few of these files created to test the rom loading with veriations of the names, such as wallet, fixed etc)

Div-Emulator-wallet combo Was not working on main site//
This issue was identified as a next load order issue and the loading order used by next was causing issues with correct rom handeling and loading. The multipul test files creaetd that were just a stand alone emulator saved as a html file were running the rom loaded from the server with no issues.

To solve this issue you suggested to use an iframe to host the div container that is hosting the emulator.This was a good solution and it worked as expected.

Current issues = styling issues//
The emulator contols are now futher down the page, and the iframe box that is hosting the div container that is hosting the emulator is not being styled as expected.
The div is important to the main styling of the page as explained in the previous issues, the iframe needs to be styled to match the div, or the iframe needs to not impact the div styling.

Reference images//  
There are 2 images both screenshots, one is the emulator.html loaded on a local port. The second is the main site with the emulator iframe loaded. Both images are complete page screenshots. the emulator controls are visible in both images to show the the current location of the emulator controls.
I would like to macth the styling of the emulator.html to the main site. To identify the main site from the emulator.html, the main site has a text header and the emulator.html does not.


///// to be updated //////
