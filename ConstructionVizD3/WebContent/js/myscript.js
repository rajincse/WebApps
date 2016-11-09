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
				
				
				var timeStamp = getTimestamp(key);
				
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

function getTimestamp(timeString)
{
	var timeKeyValue = timeString.split('||');
	var timeSplit = timeKeyValue[0].split('=');
	var timestamp = parseFloat(timeSplit[1]);
	return timestamp;
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
	var keyData = Object.keys(mainData);
	
	var imageGroup = svg.append("g")
	.attr('class', 'image-area');
	var timestampGroup= imageGroup.selectAll('g');
	timestampGroup.data(keyData).enter()
		.append('g')
		.attr('id', function(d){ return 'T-'+getTimestamp(d);});
	
	timestampGroup.selectAll('image')
		.data(function(key){			
			var items = JSON.parse('{"items":'+mainData[key]+'}');
			
			
			return items;
		}).enter()
		.append('image')
		.attr('href', function(d)
				{
					return imageData[d.name];
				})
		.attr('width', 32)
		.attr('height', 32)
		.attr('x', function(d)
				{
					var viewed = parseFloat(d.viewed);
					var id = d3.select(this).node().parentNode.attr('id');
					console.log('id:'+id);
					return 0;
				})
		;
		
	
}