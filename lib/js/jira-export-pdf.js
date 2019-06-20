
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
	console.log(issues);
	var firstTable = "<table style = 'width:100%'>";
	var secondTable = "<table style = 'width:100%'>";
	var numberColumnsOfFirstTable = 0;
	var numberColumnsOfSecondTable = 0;
	for (var i = 0; i < issues.length; i++){
		var issue = issues[i];
		var mod = i/2;
		if (mod == 0){
			if ((numberColumnsOfFirstTable/2) == 0){
				firstTable += "<tr><td style = 'width: 50%'>"
			}
			firstTable += "<div style = 'width: 98%; height: 360px; border: 3px solid black'>"
				+ "<div style = 'font-weight: bold; background: #AAA; border-bottom: 1px solid dark-gray; padding-left: 5px'>" 
				//key
					+ "<span style = 'font-size: 40px; padding-left: 5px'>" + issue.key + "</span>"
				// point
					+ "<span style = 'font-size: 34px; width: 45px; height: 45px; float: right; margin-right: 5px'>" + issue.fields.customfield_10002 + "</span>"
				+ "</div>"
				// sammary

		}
	}

	/*var table = "<table id = 'table' style = 'width:100%; padding: 10px'>";
	for (var i = 0; i< 5; i++){
		table += "<tr>";
		for (var j = 1; j < 3; j++){
			table += "<td>" + ( i +j )+ "</td>";
		}
		table+= "</tr>";
	}	
	table+="</table>";
	var pdfGenerator = html2pdf();
	$('html').append(table);

	//pdfGenerator.from($('#table')[0]).save();
	$('#table').remove();*/
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