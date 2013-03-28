//Jeremy Goldman
//VFW - Project 4
//Term 1303
//03-20-2013


//Make sure DOM in loaded and ready to go!
window.addEventListener("DOMContentLoaded", function(){


	//Shortcut for getElementById
	function $(x){
		
		var currentElement = document.getElementById(x);
		return currentElement;
	}
	
	//Create select field element, and add options
	function createGroups(){
		
		var formTag = document.getElementsByTagName("form"),
			selectLi = $('select'),
			createSelect = document.createElement('select');
			createSelect.setAttribute("id", "groups");
		
		for(var i=0, j=catGroups.length; i<j; i++){
			
			var createOptions = document.createElement('option');
			var optionText = catGroups[i];
			createOptions.setAttribute("value", optionText);
			createOptions.innerHTML = optionText;
			createSelect.appendChild(createOptions);
		}
		
		selectLi.appendChild(createSelect);
		
		
	}
	
	//Find valued of radio button
	function getSelectedRadio(){
		
		var radioButtons = document.forms[0].priority;
		for(var i=0; i<radioButtons.length; i++){
			
			if(radioButtons[i].checked){
				priorityValue = radioButtons[i].value;
			}
		}
	}
	
	

	function toggleControl(a){
		
		switch(a){
			case "on":
				$('reminderForm').style.display = "none";
				$('clearData').style.display = "inline";
				$('showData').style.display = "none";
				$('addNewForm').style.display = "inline";
				break;
			case "off":
				$('reminderForm').style.display = "block";
				$('clearData').style.display = "inline";
				$('showData').style.display = "inline";
				$('addNewForm').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
	
			}
	}
	
	function saveData(key){
		if(!key){
		
			var id = Math.floor(Math.random()*100000001);
		}else{
			
			id = key;
		}
		
		getSelectedRadio();
		
		//Form data into an object..
		//Object properties has array with label and value.
		
		var item 				= {};
		item.group 				= ["Group:", $('groups').value];
		item.remindTitle 		= ["Reminder Title:", $('remindTitle').value];
		item.dueDate			= ["Due Date:", $('due').value];
		item.priority			= ["Priority:", priorityValue];
		item.recurrence			= ["Recurrence:",$('recurrence').value];
		item.description		= ["Description:", $('description').value];
		
		
		//Save to Local Storage
		localStorage.setItem(id, JSON.stringify(item));
		alert("Reminder is set!");
	}
	
	
	function getSomeData(){
		toggleControl("on");
		
		if(localStorage.length === 0){
			
			alert("There is no data in local storage, so default data was added.");
			prefillData();
			
		}
		
		var createDiv = document.createElement('div');
		createDiv.setAttribute("id", "items");
		var createList = document.createElement('ul');
		createDiv.appendChild(createList);
		document.body.appendChild(createDiv);
		$('items').style.display = "block";

		for(var i=0, j=localStorage.length; i<j; i++){
			
			var createLi = document.createElement('li');
			var linksLi = document.createElement('li');
			createList.appendChild(createLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var reObj = JSON.parse(value);
			var createSubList = document.createElement('ul');
			createLi.appendChild(createSubList);
			
			getLSImage(reObj.group[1], createSubList);
			
			for( var n in reObj){
				
				var createSubLi = document.createElement("li");
				createSubList.appendChild(createSubLi);
				var optSubText = reObj[n][0]+" "+reObj[n][1];
				createSubLi.innerHTML = optSubText;
				createSubList.appendChild(linksLi);
			}
			
			createItemLinks(localStorage.key(i), linksLi);
		}
		
	}
	
	//Get correct image for group
	function getLSImage(groupName, createSubList){
		
		var imgLi = document.createElement('li');
		createSubList.appendChild(imgLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "img/"+ groupName +".png");
		newImg.setAttribute("height", "128");
		newImg.setAttribute("width", "128");
		imgLi.appendChild(newImg);
	}
	
	function prefillData(){
		
		for(var n in json){
			
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
			
		}
		
		
	}
	
	//Create Item Links - Creates Edit and Delete links for stored items when displayed
	function createItemLinks(key, linksLi){
		
		//edit link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Reminder";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		//Line Break
		var lineBreak = document.createElement('br');
		linksLi.appendChild(lineBreak);
		
		//delete link
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Reminder";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
		
	}
	
	function deleteItem(){
		
		var verify = confirm("Are you sure you want to delete this reminder?");
		
		if(verify){
			
			localStorage.removeItem(this.key);
			alert("Reminder was deleted!");
			window.location.reload();
			
		}else{
			
			alert("Reminder was NOT deleted.");
		}
		
	}
	
	function editItem(){
		
		// Get data from Local Storage
		var value = localStorage.getItem(this.key);
		var reminder = JSON.parse(value);
		
		
		toggleControl("off");
		$('remindTitle').value = reminder.remindTitle[1];
		$('groups').value = reminder.group[1];
		$('due').value = reminder.dueDate[1];
		$('recurrence').value = reminder.recurrence[1];
		$('description').value = reminder.description[1];
		
		if(reminder.priority[1] == "Yes"){
			
			$('priority').setAttribute("checked", "checked");
		}
		
		//remove listener from input save button
		save.removeEventListener("click", saveData);
		
		//Change Submit button value to edit button
		$('submit').value = "Edit Reminder";
		var editSubmit = $('submit');
		
		//Save the key created
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
		
	}
	
	function validate(eventData){
	
		var getDueDate = $('due');
		var getRecurrence = $('recurrence');
		var getTitle = $('remindTitle');
		
		//reset error
		errorMsg.innerHTML = "";
		getTitle.style.border = "1px solid black";
		getDueDate.style.border = "1px solid black";
		getDueDate.style.border = "1px solid black";


		
		var messageError = [];
		
		if (getTitle.value === ""){
			
			var titleError = "Please Enter a title.";
			getTitle.style.border = "1px solid red";
			messageError.push(titleError);
		
			
		}
		
		if (getDueDate.value === ""){
			
			var dueError = "Please Enter a Due Date.";
			getDueDate.style.border = "1px solid red";
			messageError.push(dueError);
		
			
		}
		
		if (getRecurrence.value === "0"){
			
			var dueError = "Please set the likelihood of recurrence.";
			getRecurrence.style.border = "1px solid red";
			messageError.push(dueError);
		
			
		}
		
		if(messageError.length >= 1){
			
			for(var i=0, j=messageError.length; i<j; i++){
				
				var text = document.createElement('li');
				text.innerHTML = messageError[i];
				errorMsg.appendChild(text);
			}
			
			
			
		}else{
			saveData(this.key);
			
		}
		
		eventData.preventDefault();
		
		return false;
		

		
	}
	
	function clearStoredData(){
		
		if(localStorage === 0){
			
			alert("There is no stored data to clear!");
			
		}else{
			
			localStorage.clear();
			alert("All reminders are cleared!");
			window.location.reload();
			return false;
		}
		
	}
	
	//Array
	var catGroups =["Personal", "Work", "Other"], priorityValue; 
	var errorMsg = $('errors');
	createGroups();
	
	
	// Click events and links
	var showDataLink = $('showData');
	showDataLink.addEventListener("click", getSomeData);
	var clearDataLink = $('clearData');
	clearDataLink.addEventListener("click", clearStoredData);
	var saveLocalData = $('submit');
	saveLocalData.addEventListener("click", validate);
	//saveLocalData.addEventListener("Click", saveData)
	
	//var save = $('submit');
	//save.addEventListener("click", saveData);

	
});
