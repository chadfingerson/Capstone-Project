console.log("award type chart.js is loaded");


google.charts.load('current', {'packages':['corechart', 'calendar', 'bar']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts(){
	drawTypePie();
	drawAwardDate();
	drawAwardCreator();
	drawAwardDepartment();
}


function drawTypePie() {
	
	
	var XHR = new XMLHttpRequest();
	var URL = '/admin/data/awardTypeCount';

	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){

			var rows = JSON.parse(XHR.responseText);
			console.log(rows);
			
			var formattedData = [];
			formattedData[0] = [ "Type of Award" , "Number of Type"];
			
			for (let i in rows){
				formattedData.push( [ rows[i].TypeOfAward , rows[i].numType ] );
			}
			
			console.log(formattedData);
			
				var data = google.visualization.arrayToDataTable(formattedData);

			var options = {
			  title: 'Awards By Type',
			  colorAxis : {maxValue: 1}
			};

			var chart = new google.visualization.PieChart(document.getElementById('piechart'));

			chart.draw(data, options);

		}
	}	
			XHR.open('GET', URL);

			XHR.send();
	

}



function drawAwardDate() {
	
	
	var XHR = new XMLHttpRequest();
	var URL = '/admin/data/awardDate';

	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){

			var rows = JSON.parse(XHR.responseText);
			console.log(rows);
			
			var formattedData = [];
			formattedData[0] = [ "Date" , "Number Created"];
			
			for (let i in rows){
				var parts = rows[i].DateTimeAward.split('-');
				var newDate = new Date(parts[0], parts[1] -1, parts[2]);
				formattedData.push( [ new Date(newDate) , rows[i].AwardCount] );
			}

			console.log(formattedData);
			
			var data = google.visualization.arrayToDataTable(formattedData);

			var options = {
				title: "Award Creation by Date",
				height: 350,
			};

			var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

			chart.draw(data, options);

		}
	}	
			XHR.open('GET', URL);

			XHR.send();
	

}


function drawAwardCreator() {
	
	
	var XHR = new XMLHttpRequest();
	var URL = '/admin/data/awardCountByCreator';

	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){

			var rows = JSON.parse(XHR.responseText);
			console.log(rows);
			
			var formattedData = [];
			formattedData[0] = [ "Name" , "Number Created"];
			
			for (let i in rows){
				formattedData.push( [ rows[i].LastName + ', ' + rows[i].FirstName , rows[i].numAwards] );
			}

			console.log(formattedData);
			
			var data = google.visualization.arrayToDataTable(formattedData);

			var options = {
				chart: {
				  title: 'Number of Awards Created by User'
				},
				bars: 'horizontal', // Required for Material Bar Charts.
				chartArea: {width: '50%'}
			  };
		  
			  var chart = new google.charts.Bar(document.getElementById('barchart_material_creator'));
		  
			  chart.draw(data, google.charts.Bar.convertOptions(options));

		}
	}	
			XHR.open('GET', URL);

			XHR.send();
	

}

function drawAwardDepartment() {
	
	
	var XHR = new XMLHttpRequest();
	var URL = '/admin/data/awardCountByDepartment';

	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){

			var rows = JSON.parse(XHR.responseText);
			console.log(rows);
			
			var formattedData = [];
			formattedData[0] = [ "Department" , "Number of Awards"];
			
			for (let i in rows){
				formattedData.push( [ rows[i].Department , rows[i].numAwards] );
			}

			console.log(formattedData);
			
			var data = google.visualization.arrayToDataTable(formattedData);

			var options = {
				chart: {
				  title: 'Number of Awards by Department'
				},
				bars: 'horizontal', // Required for Material Bar Charts.
				chartArea: {width: '50%'}
			  };
		  
			  var chart = new google.charts.Bar(document.getElementById('barchart_material_department'));
		  
			  chart.draw(data, google.charts.Bar.convertOptions(options));

		}
	}	
			XHR.open('GET', URL);

			XHR.send();
	

}
