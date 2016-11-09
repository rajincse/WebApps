var mainData={};
var imageData={};
var maxTime =0.0;
function loadData()
{
	d3.tsv("data/smallVisible.txt", function(data) {
		  
			for(var i=0;i<data.length;i++)
			{
				var key = data[i].key;
				
				var value = data[i].value;
				
				mainData[key]=value;
				
				var timeKeyValue = key.split('||');
				var timeSplit = timeKeyValue[0].split('=');
				var timeStamp = parseFloat(timeSplit[1]);
				
				if(timeStamp > maxTime)
				{
					maxTime = timeStamp;
				}
				
			}
			
		});
	
	d3.tsv("data/itemImages.txt", function(data)
	{
		for(var i=0;i<data.length;i++)
		{
			var item = data[i].item;
			
			var image = data[i].image;
			
			imageData[item]=image;
			
		}

	});
}

function render()
{
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

	var svg =d3.select('svg');
	svg.attr('width', width + margin.left + margin.right);
	svg.attr('height', height + margin.top + margin.bottom);
	
	var xScale = d3.scaleLinear().domain([0,maxTime]).range([0, width]);
	var xAxis = d3.axisBottom().scale(xScale)
    .ticks(20,"s");
	
	
	
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
    .text("Max Time:"+maxTime);
	
//	svg.append("g")
//	.attr("transform", "translate("+margin.left+"," + margin.top + ")")
//    .attr("class", "y axis")
//    .call(yAxis)
//  .append("text")
//    .attr("class", "label")
//    .attr("transform", "rotate(-90)")
//    .attr("y", 6)
//    .attr("dy", ".71em")
//    .style("text-anchor", "end")
//    .text("Rajin");
}