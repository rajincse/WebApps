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
			var item = data[i].item.trim();
			
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
    width = 15000 - margin.left - margin.right,
    height = 15000 - margin.top - margin.bottom;

	var svg =d3.select('svg');
	svg.attr('width', width + margin.left + margin.right);
	svg.attr('height', height + margin.top + margin.bottom);
	
	var xScale = d3.scaleLinear().domain([0,maxTime]).range([0, width]);
	var xAxis = d3.axisTop().scale(xScale)
    .ticks(20,"s");
	
	
	
	var yScale = d3.scaleLinear().domain([1000,0]).range([height, 0]);
	var yAxis = d3.axisLeft().scale(yScale);
	

	svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate("+margin.left+"," + (margin.top) + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -30)
    .style("text-anchor", "end")
    .text("Time");
	
	svg.append("g")
	.attr("transform", "translate("+margin.left+"," + (margin.top) + ")")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Rajin");
	var keyData = Object.keys(mainData);
	
	
	var imageGroup = svg.append("g")
	.attr('class', 'image-area')
	//.attr("transform", "translate(-"+margin.left+"," + 0 + ")")
	;
	var timestampGroup= imageGroup.selectAll('g')
		.data(keyData).enter()
		.append('g')
		.attr('id', function(d){ return 'T-'+getTimestamp(d);});
	
	timestampGroup
		.append('line')
		.attr('x1', function(d){
			return margin.left+getTimestamp(d)*width/maxTime;
		})
		.attr('y1', margin.top)		
		.attr('x2', function(d){
			return margin.left+getTimestamp(d)*width/maxTime;
		})
		.attr('y2', height+margin.top)
		.style("stroke", "#000");
	timestampGroup
		.append('title').text(function(d){return 'T:'+getTimestamp(d);});
	
	var imageWidth =32;
	var imageHeight = 32;
	timestampGroup.selectAll('image')		
		.data(function(key){			
			var items = JSON.parse(mainData[key]);
//			var itemFilter = {};
//			for(var i=0;i<items.length;i++)
//				{
//				
//				}
			
			return items;
		}).enter()
		.append('image')
		.attr('href', function(d)
				{
					return imageData[d.name];
				})
		.attr('width', imageWidth)
		.attr('height', imageHeight)
		.attr('x', function(d)
				{
//					var viewed = parseFloat(d.viewed)/1000;
					var timeString = d3.select(this.parentNode).datum();
					var timestamp = getTimestamp(timeString);
					
//					var viewedTimestamp = timestamp+viewed;
					var x = margin.left+( width*timestamp / maxTime)
					
					return x-imageWidth/2;
				})
		.attr('y', function(d)
		{
			var viewed = parseFloat(d.viewed)/1000;
			
			
			var y =( height*viewed )
			console.log('Hi:'+viewed);
			
			return y+imageHeight/2;
		})
		.append('title')
			.text(function(d)
					{
						return "name:"+d.name+", viewed:"+d.viewed;
					})
					
		;
		
	
}