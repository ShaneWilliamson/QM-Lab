QM-Lab (README best viewed on Notepad or Notepad++; not formatted for Wordpad)

For the main aspects of the codebase and project, go to cmpt371g3.usask.ca/demo/development/src/Main. 
	- Here you can see what we currently have implemented. There are several aspects of the IU that show fet=atures that are 
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
		
ID3 is a large step in that we're finally workin on the actual project, as opposed to spikes. This brings in a large number of things
			that need to be considered/included that didn't with the previous spikes. 
			
We now have continuous build integration. This is handled by our BI master, Shane Williamson:
		"Upon push/pull request to the remote repository Travis will begin execution based on the 
			instructions present in a '.travis.yml' file at the root level of the repository [development branch].

		It's a yaml file so it takes that format, customization of the build is in steps, which are 
			displayed nicely here: https://docs.travis-ci.com/user/customizing-the-build/#The-Build-Lifecycle"
		
		After loggin in with git, you can go here:https://travis-ci.com/ShaneWilliamson/QM-Lab/builds/22068619 to see the
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

=====For the coming deliverable=====
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

	- We wanted to see more logging this ID, but it didn't happen. 
	
	- We will incorporate more assertions throughout the code as well as complete the started effort of putting
		method contracts with each method, with pre and postconditions. 
	