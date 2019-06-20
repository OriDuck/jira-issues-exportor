
function exportIssuesToPdf(){
	var $activeSprint = $('.js-sprint-header:contains(Vision):contains(Active)');
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
	var firstTable = "<table style = 'width:100%'>";
	var secondTable = "<table style = 'width:100%'>";
	var numberColumnsOfFirstTable = 0;
	var numberColumnsOfSecondTable = 0;
	for (var i = 0; i < issues.length; i++){
		var issue = issues[i];
		var mod = i%2;
		if (mod == 0){
			var numberColumnsOfFirstTableModTwo = numberColumnsOfFirstTable%2;
			if (numberColumnsOfFirstTableModTwo == 0){
				firstTable += "<tr>"
			} 
			firstTable += buildIssueBlock(issue);
			if (numberColumnsOfFirstTableModTwo != 0){
				firstTable += "</tr>";
			}
			numberColumnsOfFirstTable++;
		} else {
			/*var numberColumnsOfSecondTableModTwo = numberColumnsOfSecondTable%2;
			if (numberColumnsOfSecondTableModTwo == 0){
				secondTable += "<tr>"
			} 
			secondTable += buildIssueBlock(issue);
			if (numberColumnsOfSecondTableModTwo != 0){
				secondTable += "</tr>";
			}
			numberColumnsOfSecondTable++;*/
		}
	}
	firstTable += "</table>";
	//secondTable += "</table>"
	$(firstTable).insertAfter($("head"));

}
function buildIssueBlock(issue, numberOfColumns) {

	var column = 
	"<td class = 'issue-column'>";
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
			+ "<span class = 'issue-content-order'>" + (i + 1) + "</span>"
		+ "</div>"
	+ "</td>";
	return column;
}

function getPoint(point){
	if (point == null){
		return 0;
	}
	return point;
}
$(window).load(function(){
	waitUntilElementExist('.js-sprint-header:contains(Vision):contains(Active)');
});
function waitUntilElementExist(elementSelector){
	var element = $(elementSelector);
	if (element.length > 0){
		createExportPdfButton("Vision");
		registerOnclickExportPdf();
	} else {
		setTimeout(function(){
			waitUntilElementExist(elementSelector);
		}, 100);
	}
}

function createExportPdfButton(teamName){
	var $activeSprint = $('.js-sprint-header:contains(Vision):contains(Active)');
	var $exportPdfBtn = $activeSprint.find('#export-pdf');
	if ($exportPdfBtn.length == 0){
		var $activeStatus = $activeSprint.find('.active-sprint-lozenge');
		$("<button id = 'export-pdf' />").insertAfter($activeStatus);
	}
}
function registerOnclickExportPdf(){
	$("#export-pdf").click(function(){
		exportIssuesToPdf();
	});
}