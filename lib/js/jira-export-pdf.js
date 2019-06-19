
function queryIssuesFromJira(){
	$.ajax({
		url: 'http://jira.axonivy.com/jira/rest/api/2/search?jql=issuetype in (Bug, Story) AND Sprint="Vision 7.32" ORDER BY RANK',
		headers: {
                    'Content-Type' : 'application/json'
        },
    	type: "GET",
    	datatype: "jsonp",
    	crossDomain:true,
    	success: function(response){
    		console.log(data);
    	}
	});
}

function generate(){
	var stories = queryIssuesFromJira();

	var table = "<table id = 'table' style = 'width:100%; padding: 10px'>";
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
	$('#table').remove();
}
$(window).load(function(){
	waitUntilElementExist('.js-sprint-header:contains(Vision):contains(Active)');

	/*$('.js-sprint-header:contains(Vision):contains(Active)').hover(function(){
		var $this = $(this);
		var $printerBtn = $this.find('#printerBtn');
		if ($printerBtn.length == 0){
			var $activeStatus = $this.find('.active-sprint-lozenge');
			$("<button id = 'printerBtn' >Print</button>").insertAfter($activeStatus);
		}
		$(this).append("<button id = 'printerBtn'>Print</button>");
	})
	$('.js-sprint-header:contains(Vision):contains(Active)').load(function(){
		console.log("vo ne: " + $(this));
	})*/
});
function waitUntilElementExist(elementSelector){
	var element = $(elementSelector);
	if (element.length > 0){
		createExportPdfButton("Vision");
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