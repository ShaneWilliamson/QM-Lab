QM-Lab Qualitative Modelling Collaboratively

===Git Use===
After cloning, please run **git-setup.sh**. It is located in the root of the git repository. This will set up the commit template for your new repository. 

As well, please make sure that before you begin work you refer to the set of [Git Standard Practices](https://github.com/ShaneWilliamson/QM-Lab/wiki/Git-Standard-Practices).

Please see the [wiki](https://github.com/ShaneWilliamson/QM-Lab/wiki) for an in-depth project description.

The wiki pages are pretty barren at the moment, so if you have something to add please do so!

ID4
=====
We have a Documents manager (Angela), whom I have asked to make all files homogenized between github and google docs; ie. same files, same organization. 

The main project can still be found at cmpt371g3.usask.ca/demo/development/src/Main

Unfortunately, finding times to get together for meetings and reviews this week has been very difficult, as several classes have been approaching 
	end of term crunch. We did a lot more discussing things over slack and making use of our issue tracker to keep track of each other
	and communicate. We did have a large meeting saturday the 12th where quite a lot of stuff got done, however, it was mainly a 
	working meeting, with quite a lot of pair programming. 
	
	Michael Kelly and Matthew were pair programming working on the sharing, printing, saving
	Michael Ruffel and Connor were pair programming working on the UI for hooking up ability to change the nodes' traits, such as text, color, font size
	Angela and Benjin were there working on testing. Angela has taken lead of the selenium testing, and Benjin has done a lot of testing coverage plans. 
	Corey was there, setting up the method contracts as proper jsdocs, and converting the existing contracts to that. 
	I spent the time moving between the groups, seeing what they were doing, giving them feedback, giving them direction on what to work on,
		seeing how things were done, and eating cookies. 
	
For testing, there was a significant push this deliverable for coverage testing and unit testing. You can see the results of our coverage testing 
	here: http://puu.sh/nLSbw/d30433c666.png
	
	for more info on testing, you can see their more comprehensive report on the git wiki here https://github.com/ShaneWilliamson/QM-Lab/wiki/Testing
		which should also be posted to the git and drive as a document. 
	
We have also begun triage. We decided (not in a meeting, so there are no minutes) to hold off on making the export to json to save locally, and load. 
	we found that that would be a fairly involved process, and we will do that if it's important to the stakeholder for ID5. We also have begun triaging 
	the issue tracker. Working through the issues, removing the bugs, removing the ones that have been done, deciding on which ones need to be done for
	this deliverable. 
	
We also had a code freeze friday at noon. Because of some issues with merging, it ended up being extended a few hours, but the testing team had already 
	been working on things during the week, so it didn't cause much headache. 
	
There is also now a changelog to describe the new features that have been implemented in the system, and outline how to use it, and what's to come. 

On the Build-integration side, we have some improvements with the implementation of Linting. 
	





ID3
=====
For the main aspects of the codebase and project, go to cmpt371g3.usask.ca/demo/development/src/Main. 
	- Here you can see what we currently have implemented. There are several aspects of the IU that show features that are 
		not yet implemented. 
	Implemented:
		Nodes: (with the caviat that you can simply place pre-existing nodes; they are not yet customizable)
		- Stock
		- Image
		- Variable
		- Parameter
		Links:
		- Flow
		- Simple Straight
		- Simple Curved
		
	Not Yet Implemented:
		Nodes: 
		- State
		- Terminal State
		- Box
		- Text Area
		Links:
		- Directional Arrow
		- Dashed Line
		Buttons:
		-Save
		-Load
		-Share
		
ID3 is a large step in that we're finally workin on the actual project, as opposed to spikes. This brings in a large number of things
			that need to be considered/included that didn't with the previous spikes. 
			
We now have continuous build integration. This is handled by our CI master, Shane Williamson:
		"Upon push/pull request to the remote repository Travis will begin execution based on the 
			instructions present in a '.travis.yml' file at the root level of the repository [development branch].

		It's a yaml file so it takes that format, customization of the build is in steps, which are 
			displayed nicely here: https://docs.travis-ci.com/user/customizing-the-build/#The-Build-Lifecycle"
		
		After logging in with git, you can go here:https://travis-ci.com/ShaneWilliamson/QM-Lab/builds/22068619 to see the
			builds that have been done and when. 
		
On the Github wiki, we have some information on the teams, for which there have been some changes:
	- Mahmoud Mahmoud has dropped the class, and as such, Jordan Wong has replaced him as Testing Lead.
	- Angela Stankowski is the documents Manager
	- James McKay has been added to the testing team. 
	
Issue tracking is now visible and is being filled out on the gitlab wiki. 

Testing was mainly Selenium for this deliverable. There is a document describing the testing that's been done for ID3 
		on the google docs page. 
	
We have gone through the meeting minutes and separated out the mini-milestones and reviews to make those clear to the markers. 
		Those should be visible in their own clearly-marked folders on the development branch of git. 
	
All the major backend has been implemented for the system as of ID3, including the connecting of joint.js and the Google API

There were some things added by the design team; diagrams and documents, which will be available on the repo as well as with google.

____________________________________

For the coming deliverable
=====
____________________________________

The main thing is that we are going to do be working through the requirements document, setting several mini-milestone dates,
	and prioritizing which features we can reaonably expect at each stage, based on the priority from the stakeholder as well
	as the difficulty and/or time associates with completing it. 
	- We will be meeting early this coming week to make a more concrete roadmap, then meeting with the stakeholder to 
		make sure that the decisions on features are preferable, and giving him/them the opportunity to influence them. 
	
	- We will put a lot more time into both logging, issue tracking, and TESTING TESTING TESTING.
		Testing has been one of our largest issues in the past deliverables, and the testing team has spent most of 
		this deliverable playing with selenium, which is powerful, and you can see a description of the progress made 
		in the document described earlier. However, to our dismay, this resulted in our unit testing, coverage testing, 
		and other testing in general to come up woefully short for this deliverable. Now that we have Selenium largely 
		tackled, we will be very aggressive with the full suite of tests for the coming deliverable. 
		
	- We will also begin our first serious triage for the coming deliverable. Now that we have the infrastructure in place, 
		issue tracking will see a lot more use, as well as its own validation and triage process as discussed in class. 

	- We wanted to see more logging this ID, but it didn't happen. However, we have looked into log4javascript, and it
		WILL be in the next deliverable. 
	
	- We will incorporate more assertions throughout the code as well as complete the started effort of putting
		method contracts with each method, with pre and postconditions. 
	