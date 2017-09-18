var width = $("#barchartContainer").width(),
height = 350;
function change(table){
var row = table.insertRow(table.rows.length);
for(j=0;j<table.rows[0].cells.length;j++){
var cell = row.insertCell(j);
cell.height = "24px";
cell.innerHTML = table.rows[0].cells[j].innerHTML;
}
table.deleteRow(0);
};
function tableInterval(){
var table = document.getElementById("test");
change(table);
};

  function tabulate(data, columns) {
		var table = d3.select('#table').append('table').attr("class","table")
		var thead = table.append('thead')
		var	tbody = table.append('tbody').attr("id","test");


		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
		    .text(function (column) { return column; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .text(function (d) { return d.value; });

	  return table;
	}

	  d3.json("data/tabledata.json", function(error, data) {
    tabulate(data, ['Market', 'Order No.','Date/Time']);

  });
  setInterval("tableInterval()",1000);
