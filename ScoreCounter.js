//print out the scores for all of the users
function printResultsForUsers(userHolder) {
	var userOutput = ""
	var teamScore = 0;
	for (var k = 0; k < userHolder.length; k++) {
		var selectedUserForPrinting = dataHolder.userHolder[k];
		var pageScore = selectedUserForPrinting.trophyCount + ((10 - 1) * selectedUserForPrinting.platinumCount);
		if (selectedUserForPrinting.forumUserName.indexOf("(HTC)") > -1)
			pageScore = pageScore * 2;
		userOutput = userOutput + selectedUserForPrinting.forumUserName + ": " + pageScore + " (" + selectedUserForPrinting.platinumCount + ")" + "\n";
		teamScore = teamScore + pageScore
		
		//every team is made out of 4 players
		//so every 4 players print their team score and reset it to 0
		if (k % 4 === 3) {
			userOutput = userOutput + "Team Score: " + teamScore + "\n\n";
			teamScore = 0;
		}
	}
	console.log(userOutput)
}

function printResultsForGames(gameHolder) {
	var gameOutput = "";
	Object.keys(gameHolder).forEach(function(key,index) {
			var game = dataHolder.gameHolder[key];
			gameOutput = gameOutput + game.name + '%' + game.players.length + '%' + game.platPlayers.length + '%' + game.players.toString() + '%' + game.platPlayers.toString() + "\n";
	});
	console.log(gameOutput)
}

function processUserList() {
	var userList = [ //names go in pairs, psn username followed by forum name
		"GarciaFever", "GarciaFever",
		"jem12345", "jem12345",
		"DanteHellMode98", "Mace Windu",
		"TheLastSurvivorD", "TheLastSurvivorD",
		
		"Superunknown9281", "Andrea",
		"cjshaitan", "cjshaitan",
		"HcG-_Clawz", "HcG Clawz",
		"pureproteinman", "Pureproteinman",
		
		"bladesoframen", "bladesoframen",
		"ggamer15", "Gage",
		"MrUnknown625", "MrUnknown625",
		"Wdog-999", "Walt the Dog",
		
		"Kuroi-Akira", "Akira", 
		"Magician_Alice", "Alice Margatroid",
		"Kochiya-Shana", "Kochiya-Shana",
		"BloodyMarythe1st", "Marisa Kirisame",
		
		"Dennis-nine-five", "Dennis-nine-five",
		"FFHannibal", "FFHannibal",
		"J2V_89", "J2V_89",
		"ReimiSaionji9742", "Saionji",
		
		"Ichiban-Hybrid", "Abyss Crown", 
		"dougbarrett619", "dougbarrett619",
		"MDub_Waz_Here", "MDub_Waz_Here",
		"shadowhood1111", "shadowhood1111",
		
		"MStalker58", "MStalker58", 
		"Power0fPhonixHD", "Power0fPhonixHD",
		"X18JELLO18X", "X18JELLO18X",
		"woop94", "woop94",

		"Kishnabe", "Kishnabe",
		"LucasV9991", "LucasV9991",
		"Tanuzomi", "Tanuzomi",
		"whyfire", "Whyfire",
		
		"PhantomOfThorns", "PhantomOfThorns",
		"RainstormIII", "RainstormIII",
		"TKKOT", "TKKOT",
		"Triicky913", "Triicky913",
	];
	dataHolder = {};
	dataHolder.userHolder = [];
	dataHolder.gameHolder = {};
	dataHolder.currentUserIndex = 0;
	//initiatialize values for every user
	for(var i= 0; i < (userList.length / 2); i++) {
		dataHolder.userHolder[i] = {};
		dataHolder.userHolder[i].userName = userList[2*i];
		dataHolder.userHolder[i].forumUserName = userList[(2*i)+1];
		dataHolder.userHolder[i].trophyCount = 0;
		dataHolder.userHolder[i].platinumCount = 0;
		dataHolder.userHolder[i].gameArray = [];
		dataHolder.userHolder[i].platinumGameArray = [];		
	}
	return dataHolder;
}

function checkForUserList() {
	var dataHolder = sessionStorage.getItem('dataHolder');
	if (!dataHolder)
		dataHolder = processUserList();
	else
		dataHolder = JSON.parse(dataHolder);
	return dataHolder;
}


var dataHolder = checkForUserList();
var selectedUserInfo = dataHolder.userHolder[dataHolder.currentUserIndex];
var inTrophyLog = window.location.href.indexOf('/log') > 26; //assuming the username is at least 2 characters long, it'll skip the username check (or 1 character for https)

if (inTrophyLog) {
	var startTime = "2016-10-31T15:00:00.000-08:00"; //In ISO-8601 format, please replace with necessary value
	var endTime = "2016-11-20T16:00:00.000-08:00"; //In ISO-8601 format, please replace with necessary value
	var oldTrophyCount = selectedUserInfo.trophyCount
	var trophyRows = document.querySelectorAll("#content .box .zebra tr");
	var processedStartTime = new Date(startTime);
	var processedEndTime = new Date(endTime);
	for (var i = 0; i < trophyRows.length; i++) {
		var trophyRow = trophyRows[i];
		//the first row in the table has no children so it can cause errors
		if (trophyRow.firstElementChild && trophyRow.children[1]) {		
			//get time the trophy was acheived and see if it is within the date limits before doing other checks
			var timeAcheievedContainer = trophyRow.children[5].children[0];
			var dateObtainedFirstHalf = timeAcheievedContainer.children[0].textContent;
			dateObtainedFirstHalf = dateObtainedFirstHalf.replace(/(\d+)(st|nd|rd|th)/, "$1");
			var dateObtainedSecondHalf = timeAcheievedContainer.children[2].textContent;
			var timeAcheived = new Date(dateObtainedFirstHalf + " " + dateObtainedSecondHalf);
			if (timeAcheived.getTime() > processedStartTime.getTime() && timeAcheived.getTime() < processedEndTime.getTime()) {
				var trophyRarity = trophyRow.children[8].children[0].children[2].children[0].textContent;
				var trophyValue = 0;
				if (trophyRarity === "Common") 
					trophyValue = 1;
				else if (trophyRarity === "Uncommon")
					trophyValue = 1.1;
				else if (trophyRarity === "Rare")
					trophyValue = 1.25;
				else if (trophyRarity === "Very Rare")
					trophyValue = 1.5;
				else if (trophyRarity === "Ultra Rare")
					trophyValue = 2;
				selectedUserInfo.trophyCount += trophyValue
				
				//get name of game and add new ones to array
				var gameName = trophyRow.children[0].children[0].children[0].getAttribute("title");
				if (!selectedUserInfo.gameArray.includes(gameName)) {
					selectedUserInfo.gameArray.push(gameName);
				}
				
				//check if plat, if so, add to plat count and plat list
				var trophyType = trophyRow.children[9].children[0].children[0].getAttribute("title");
				var plat = false;
				if (trophyType === "Platinum") {
					selectedUserInfo.platinumCount += trophyValue;
					selectedUserInfo.platinumGameArray.push(gameName)
					plat = true;
				}
				
				//add game to gamelist
				//if game already exist, add name to list
				//else create entry for the game and add name to list
				//afterward check add plat if there
				if(!dataHolder.gameHolder[gameName]) {
					dataHolder.gameHolder[gameName] = {};
					dataHolder.gameHolder[gameName].name = gameName;
					dataHolder.gameHolder[gameName].platPlayers = [];
					dataHolder.gameHolder[gameName].players = [];
				}
				if (!dataHolder.gameHolder[gameName].players.includes(selectedUserInfo.forumUserName))
					dataHolder.gameHolder[gameName].players.push(selectedUserInfo.forumUserName) 
				if (plat && !dataHolder.gameHolder[gameName].platPlayers.includes(selectedUserInfo.forumUserName))
					dataHolder.gameHolder[gameName].platPlayers.push(selectedUserInfo.forumUserName) 
			}		
		}
	}
}
else { //assume we're on user's page, needs to have more robust url detection later
	//get game's table, and check the first 100 games for games with 100%
	//then check if the player has played those games
	//if he has, add them to the plat list
	var gamesTable = document.querySelectorAll("#gamesTable tr")
	for (var i = 0; i < gamesTable.length; i++) {
		var game = gamesTable[i];
		if (game.firstElementChild && game.className === "completed") {
			var gameName = game.children[1].children[0].textContent;
			//check if the player played that game during this period before adding and not already there in the plat list
			if (dataHolder.gameHolder[gameName] && dataHolder.gameHolder[gameName].players.includes(selectedUserInfo.forumUserName) && !dataHolder.gameHolder[gameName].platPlayers.includes(selectedUserInfo.forumUserName)) {
				dataHolder.gameHolder[gameName].platPlayers.push(selectedUserInfo.forumUserName) 
			}
		}
	}
}
//save everything
sessionStorage.setItem('dataHolder', JSON.stringify(dataHolder));

//go to necessary page depending on condition
//go to next page if trophy count did change
//go to user's profile page if trophy count did not change
//go to next user if on user's profile page
if (inTrophyLog){
	//check if trophy count changed
	if (oldTrophyCount === selectedUserInfo.trophyCount) {
		var username = dataHolder.userHolder[dataHolder.currentUserIndex].userName;
		var userProfileUrl = "http://psnprofiles.com/" +  username;
		window.location.href = userProfileUrl;
	}
	else {
		var currentPage = window.location.href;
		var lastEqualSignIndex = currentPage.lastIndexOf('=');
		var pageNumber = Number(currentPage.substring(lastEqualSignIndex + 1));
		if (isNaN(pageNumber)){
			pageNumber = 1; //in case pagNumber is not in the url
		}
		
		var trophyLogUrl = "http://psnprofiles.com/" +  selectedUserInfo.userName + "/log?page=" + (pageNumber + 1);
		window.location.href = trophyLogUrl;
	}
}
//assume we're now in user's profile
else {
	if (dataHolder.currentUserIndex + 1 < dataHolder.userHolder.length) { //if last user, just print the results instead
		dataHolder.currentUserIndex++;
		sessionStorage.setItem('dataHolder', JSON.stringify(dataHolder)); //need to save again for change in userIndex
		var username = dataHolder.userHolder[dataHolder.currentUserIndex].userName;
		var trophyLogUrl = "http://psnprofiles.com/" +  username + "/log?page=1";
		window.location.href = trophyLogUrl;
	}
	else {
		//print results for players and games
		printResultsForUsers(dataHolder.userHolder);
		printResultsForGames(dataHolder.gameHolder);
	}
}