var mainData={};
var maxTime =0;
function loadData()
{
	d3.tsv("data/smallVisible.txt", function(data) {
		  
			for(var i=0;i<data.length;i++)
			{
				var key = data[i].key;
//				var timeKeyValue = key.split('||');
//				var timeSplit = timeKeyValue[0].split('=');
//				console.log('Time:'+timeSplit[1]);
				
				
				var value = data[i].value;
				
				mainData[key]=value;
				
			}
			
		});
}

function render()
{
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

	var svg =d3.select('svg');
	svg.attr('width', width + margin.left + margin.right);
	svg.attr('height', height + margin.top + margin.bottom);
	
	var xScale = d3.scaleLinear().range([0, width]);
	var xAxis = d3.axisBottom().scale(xScale);
	
	var yScale = d3.scaleLinear().range([height, 0]);
	var yAxis = d3.axisLeft().scale(yScale);
	
	svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate("+margin.left+"," + (height+margin.top) + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -30)
    .style("text-anchor", "end")
    .text("Rajin");
	
	svg.append("g")
	.attr("transform", "translate("+margin.left+"," + margin.top + ")")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Protein (g)");
}