
var sprintHeader = '.js-sprint-header:contains(Vision):contains(Active)';
$(window).load(function(){
	//waitUntilElementExist('.js-sprint-header:contains(Vision):contains(Active)');
	waitUntilElementExist(sprintHeader);
});
function exportIssuesToPdf(element){
	var $activeSprint = $(element).closest(sprintHeader);
	var sprintName = $activeSprint.find("[data-fieldname=sprintName]").text();
	$.ajax({
		url: 'https://jira.axonivy.com/jira/rest/api/2/search?jql=issuetype in (Bug, Story) AND Sprint="' + sprintName +'" ORDER BY RANK',
		headers: {
                    'Content-Type' : 'application/json'
        },
    	type: "GET",
    	datatype: "jsonp",
    	crossDomain:true,
    	success: function(data){
    		doExport(data.issues);
    	}
	});
}

function doExport(issues){
	var firstTable = "<table class = 'issues-table'>";
	var secondTable = "<table class = 'issues-table'>";
	var numberColumnsOfFirstTable = 0;
	var numberColumnsOfSecondTable = 0;
	for (var i = 0; i < issues.length; i++){
		var issue = issues[i];
		var mod = i%2;
		if (mod == 0){
			firstTable += buildIssue(issue, i, numberColumnsOfFirstTable);
			numberColumnsOfFirstTable++;
			var subtasks = filterWithoutUnneedTask(issue);
			firstTable += buildSubTasks(subtasks, issue.key, numberColumnsOfFirstTable);
			numberColumnsOfFirstTable = increaseNumberOfColumsBySizeOfSubtask(subtasks, numberColumnsOfFirstTable);
		} else {
			secondTable += buildIssue(issue, i, numberColumnsOfSecondTable);
			numberColumnsOfSecondTable++;
			var subtasks = filterWithoutUnneedTask(issue);
			secondTable += buildSubTasks(subtasks, issue.key, numberColumnsOfSecondTable);
			numberColumnsOfSecondTable = increaseNumberOfColumsBySizeOfSubtask(subtasks ,numberColumnsOfSecondTable);
		}
	}
	firstTable += "</table>";
	secondTable += "</table>"
	openNewWindow(firstTable);
	openNewWindow(secondTable);
}

function filterWithoutUnneedTask(issue){
	var unneedTasks = ["Crosscheck", "Cross Check"];
	return $.grep(issue.fields.subtasks, function (task){
		return $.inArray(task.fields.summary, unneedTasks)
				|| task.fields.status.statusCategory.key == 'done';
	});
}

function openNewWindow(tableAsString){
	var cssLink = chrome.extension.getURL("lib/css/issue-export-pdf.css");
	var newWindow = window.open();
	$(newWindow.document.head)
		.html('<link type="text/css" rel="stylesheet" href="' + cssLink + '">');
	$(newWindow.document.body).html(tableAsString);
}
function increaseNumberOfColumsBySizeOfSubtask(subtasks, numberOfColumns){
	var subtasksSize = subtasks.length;
	if (subtasksSize > 0){
		numberOfColumns = numberOfColumns + subtasksSize;
	}
	return numberOfColumns;
}

function buildIssue(issue, index, numberOfColumns) {
	var issueColumn = "";
	var numberOfColumnsModTwo = numberOfColumns%2;
	if (numberOfColumnsModTwo == 0){
		issueColumn += "<tr class = 'issues-row'>";
	} 
	issueColumn +=
		"<td class = 'issue-column'>"
			+ "<div class = 'issue-colum-content'>"
				+ "<div class = 'issue-content-header'>" 
				//key
					+ "<span class= 'issue-content-key'>" + issue.key + "</span>"
				// point
					+ "<span class = 'issue-content-point'>" + getPoint(issue.fields.customfield_10002) + "</span>"
				+ "</div>"
				// sammary block
				+ "<div class = 'issue-content-summary-container'>" 
					// sammary
					+ "<div class = 'issue-content-summary'>" + issue.fields.summary + "</div>"
					// order
					+ "<span class = 'issue-content-order'>" + (index + 1) + "</span>"
				+ "</div>"
			+"</div>"	
		+ "</td>";
	if (numberOfColumnsModTwo != 0){
		issueColumn += "</tr>";
	}
	return issueColumn;
}
function buildSubTasks(subtasks, issueKey, numberOfColumns){
	var subTaskAsTable = "";
	for (var i = 0 ; i < subtasks.length; i++){
		var subtask = subtasks[i];
		var summary = subtask.fields.summary;
		var numberOfColumnsModTwo = numberOfColumns%2;
		if (numberOfColumnsModTwo == 0){
			subTaskAsTable += "<tr class = 'issues-row'>"
		} 
		subTaskAsTable += buildSubtask(subtask, issueKey);
		if (numberOfColumnsModTwo != 0){
			subTaskAsTable += "</tr>"
		} 
		numberOfColumns++;
	}
	return subTaskAsTable;
}

function buildSubtask(subtask, issueKey) {
	return "<td class = 'issue-column'>"
				+ "<div class = 'issue-colum-content'>"
					+ "<div class = 'subtask-content-header'>" 
					//key
						+ "<span class= 'issue-content-key'>" + issueKey + "</span>"
					+ "</div>"
					// sammary block
					+ "<div class = 'issue-content-summary-container subtask-content-container'>" 
						+ "<span>" + subtask.fields.summary + "</span>"
					+ "</div>"
				+"</div>"	
			+ "</td>";
}
function getPoint(point){
	if (point == null){
		return 0;
	}
	return point;
}
function waitUntilElementExist(elementSelector){
	var element = $($(elementSelector)[0]);
	if (element.length > 0){
		createExportPdfButton(element);
		registerOnclickExportPdf();
	} else {
		setTimeout(function(){
			waitUntilElementExist(elementSelector);
		}, 100);
	}
}

function createExportPdfButton(element){
	var $activeSprint = element;
	var $exportPdfBtn = $activeSprint.find('#export-pdf');
	if ($exportPdfBtn.length == 0){
		var $badgeGroup = $activeSprint.find('.ghx-issue-count');
		$("<button id = 'export-pdf' />").insertBefore($badgeGroup);
	}
}
function registerOnclickExportPdf(){
	$("#export-pdf").click(function(){
		exportIssuesToPdf(this);
	});
}