QM-Lab Qualitative Modelling Collaboratively

===Git Use===
After cloning, please run **git-setup.sh**. It is located in the root of the git repository. This will set up the commit template for your new repository. 

As well, please make sure that before you begin work you refer to the set of [Git Standard Practices](https://github.com/ShaneWilliamson/QM-Lab/wiki/Git-Standard-Practices).

Please see the [wiki](https://github.com/ShaneWilliamson/QM-Lab/wiki) for an in-depth project description.

The wiki pages are pretty barren at the moment, so if you have something to add please do so!

ID5 
=====

This was a more difficult ID for us in general. I felt that we were struggling quite a bit with other classes, which slowed us down quite a bit. 
	that being said, we pressed forward, and now we're at the end of it, and if you feel the project was a success, so do we. 
	
Testing report: The testing team worked on unit tests that gave additional coverage to the program. Manual tests were performed and if any bugs 
	were found they would be sent to the GitHub issue tracker. In addition to sending bugs to the GitHub issue tracker there was a test report 
	that would track the overall status of the application’s functionality. The test cases, test scenario, and test matrix were improved and added 
	to, as they were a lot easier to use. For an example, before you had to identify what type of test scenario your test scenario was (unit test, 
	system test, etc.) but that wasn’t practical so now no type is required when adding a test scenario. Finally we added the Selenium Grid into our 
	automation. Selenium Grid runs both Firefox and Chrome simultaneously. Selenium works really well with automation and future builds as it looks 
	for key identifiers for elements (uses mostly xpath to find elements that contain words). If time permitting we would like to change all the 
	find elements to xpaths instead of using ids. As well our Selenium tests try two methods to log into Google (as there are two layouts to log in) 
	and if the first method fails the second method will work. 
	
Matt report regarding drag select: 
	Drawing box
		- had to thoroughly search joint documentation trying to find a way to create a simple box. 
			- couldn’t find anything. 
			- took a while to figure this out
		- had to draw directly to canvas. 
			- tried to draw to the normal raster canvas, 
			- didn’t work. 
			- finally figured out I could request the svg canvas instead
			- Had to insert an html element directly into the dorm. 
				- didn’t know how to do that, had to figure it out piece by piece. 
				- insert into right canvas
		- yay drag selection box drawing is working or is it. 
			- boxes are only being drawn properly when dragged from top left to bottom right. 
			- but why?
			- turns out after some painstaking debugging that s_vg elements must have a positive width and height and always 
					have to be drawn from top left to bottom right.
			- So what if the user drags from bottom right to top left? 
				- answer = nothing. 
				- solution was relatively simple, but figuring out what the real issue was the hard part
				- solution = conversion function to convert a_r_bi_t_ary two points into s_vg friendly rect 
					(width,height, starting point) 
			- Yay drag selection box is working ... still nope
				- doesn’t work when the canvas is zoomed in/out 
				- but why? 
				- box selection coords are relative to screen since they are mouse coords
				- however the e Intjre s_vg canvas is actually being zoomed and the box is being drawn relative to the canvas itself
				- solution = track the relative zoom of the canvas and scale the box coords appropriately.  
			- yay drag selection box is working ... still nope
				- when the canvas is panned the box is drawn at wonky coords. 
				- luckily this is issue is pretty similar to the zooming thing, so it is easily solved
			- THE BOX NOW DRAWS SUCCESSFULLY WHEN DRAGGED!!! YAY 
		- Better Selection 
			- while things were selectable, existing object strokes were overwritten
			- So I redid selection found a highlight() method that looked promising 
			- figured out after some trial and error that I could get all of the objects within an area in the GRAPH. 
			- couldn’t set the objects as highlighted though.  
			- After some headbangjng I figured out that it was because the graph only holds some attributes for objects 
					(width, height, text, etc...), but highlighting and styling information is held in the “Paper”
			- Solution = query the paper for the view corresponding to the graph data item and set the view as highlighted. 
		- Moving multiple selected items
			- Should be easy right? 
			- detect a drag, then apply a translation to all highlighted elements by the proper (scaled and relative) amount
			- To detect the drag though we have to register an event handler with the paper
		- So we do just that, and the code to get a list of highlighted items, then find the corresponding items in the graph and translate them
		- Now the item that we are dragging the group around with is being moved twice as much as the other items in the group
		- Okay so the paper’s internal event handler is probably attempting to move the item around since we are dragging on it
		- Essentially the object is being dragged _s_i_m_ul_ate_no_u_s_ly by two event handlers
		- After scouring the joint is documentation for a way to disable the default event handler, there isn’t anything
		- Can’t really tell which graph element is actually being dragged either
		- So I attempt to undo our second drag with yet another drag handler, which would perform a negative translation, In effect undoing our other drag handler
		- Now our dragged item is moving properly, but the other items in the group are doing weird stuff. Jumping around and “jittering”
		- Maybe we can interrupt the initial event handler and consume the event, preventing the double dragging.
		- However the paper’s event handlers are always registered before, and thus have higher priority than ours
		- Around this point the two Michaels from the implementation team spend an hour or two with me trying to figure this out as a team
		- Nobody can really figure out anything else to try
		- FeelsBadMan.jpg
		- Try to pry into the jojnth spaghetti code to find out where the internal event handlers are/try to block them
		- Can’t
		- And this is where the tale ends

		
	I apologize for the wall of text, but we really needed to drive home that he put a lot of effort into this, and 
		it just didn't work out. 
		
Other ontes include that we had a Code Freeze, which was originally for the prior thursday, then pushed to friday due to things not quite
	being ready, then pushed to Saturday after we got the extension. 
	
Saturday we had a bug party. It turned out to be a lot more bugfixing than bug finding, however, Corey and I were able to locate 
	a number of bugs, and provide direction to the implementation and testing team that were there. I went through all the 
	issues in the tracker and triaged them. There was Corey, Michael Ruffel, Matt, Shane, Connor and Angela there. 

Tuesday during the lab session, we had the final reviews. I had found that Benjin, Angela and Mitchell had not yet had their reviews. 
	since most of the group was there, we split into 2 smaller reviews and conducted multiple reviews simultaneously, while we 
	populated each group with relevant members. 
		
I personally for this deliverable and a bit of the last, ended up spending a lot more energy micro managing the implementation team. 
	Michael Ruffel was contributing to the code meaningfully, but not being a strong leader, and nobody else seemed interested, so
	I ended up leading them much more closely than the other teams in which cases, I typically only really spoke with the team leads. 
		
The exception to the last point was when Corey brought to my attention that he was not sure what contributions Mitchell had made 
	that ID and asked me to speak to him about it, so I did. I found out that Mitchell had simply gotten busy with the other assignments and
	lost track of the deliverable on this one, and he assured me that he would get that work done as soon as possible then continue on to ID5. 
	A follow up a short while later told me that he had been working on the material assigned by Corey. 
	
Where to go from here: 
	- I think that I would actually move away from joint.js for links. While it proved useful for the project, moving further, it might end 
		up being too restrictive. It became very difficult to get certain desired behaviors from the links; particularly the Flows. 
		While we were successful in getting the pipe appearance, it did require modification of joint.js itself, which makes updates
		of joint.js risky. It also was limiting in the style and nature of the labels or marks we could add. Adding the 'valve' on
		the flow was actually only really possible through text. We were limited to having text labels appear as either large blob 
		labels, or be whitespace, and either way, intersecting the line itself; not being above or below it. 
	Additionally, I find that working with joint.js links to be generally troublesome in that they have useablitlity issues, with which 
		you are familiar. 
	
	There is an existing set of updated issues in the tracker which you can see, and is up to date as per my knowledge. 
	
ID4
=====
We have a Documents manager (Angela), whom I have asked to make documents homogenized between github and google docs as much as possible; ie. same documents, 
	same organization, where possible. However, the git repo is still the main source for documentation, and will have things like jsdocs. 

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
	
We have jsdocs to be found under doc>js_docs>index.html on the repo. 




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
	