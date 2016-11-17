function contextRendering()
{
	
	var svg =d3.select('svg');
	
	svg.attr('width',svgWidth);
	svg.attr('height',svgHeight);
	

	
	var marginFocus = {top: 20, right: 20, bottom: 160, left: 40},
    marginContext = {top: 430, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - marginFocus.left - marginFocus.right,
    heightFocus = +svg.attr("height") - marginFocus.top - marginFocus.bottom,
    heightContext = +svg.attr("height") - marginContext.top - marginContext.bottom;
	
	var xScaleFocus = d3.scaleLinear().range([0,width]);
	var xAxisFocus = d3.axisBottom(xScaleFocus);	
	var yScaleFocus = d3.scaleLinear().range([0,heightFocus]);
	var yAxisFocus = d3.axisLeft(yScaleFocus); 
	
	
	var xScaleContext = d3.scaleLinear().range([0,width]);	
	var xAxisContext = d3.axisBottom(xScaleContext);	
	var yScaleContext = d3.scaleLinear().range([0,heightContext]);
	
	
    
	var brushContext = d3.brushX()
    .extent([[0, 0], [width, heightContext]])
    .on("brush end", brushed);

	var zoomFocus = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, heightFocus]])
    .extent([[0, 0], [width, heightFocus]])
    .on("zoom", zoomed);
	
	svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", heightFocus)
    .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")")
    .call(zoomFocus);
	
	var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")");

	var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + marginContext.left + "," + marginContext.top + ")");
	
	var keyData = Object.keys(mainData);
	
	xScaleFocus
		.domain(
			d3.extent(keyData, 
					function(key){
						return getTimestamp(key);
					})
		);
	var maxY = 100;
	yScaleFocus.domain([maxY,0]);
	
	xScaleContext.domain(xScaleFocus.domain());
	yScaleContext.domain(yScaleFocus.domain());
	
	focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + heightFocus + ")")
    .call(xAxisFocus);

	focus.append("g")
    .attr("class", "axis axis--y")
    .call(yAxisFocus);
	
	context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + heightContext + ")")
    .call(xAxisContext);
	 context.append("g")
      .attr("class", "brush")
      .call(brushContext)
      .call(brushContext.move, xScaleFocus.range());
	 
	 
	 
	 svg.append('text')
      .attr("class", "label")      
      .attr("x", -heightFocus/2)
      .attr("y", 12)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Camera Distance");
	 
	 svg.append('text')
     .attr("class", "label")      
     .attr("x", width+10 )
     .attr("y", heightFocus+10)
     .style("text-anchor", "end")
     .text("Time");
	 
	 // Focus Region
	 function renderFocus()
	 {
		 d3.select(focus).node().selectAll('g.image-area').remove();
		 
		 var minXFocus = xScaleFocus.range()[0];
		 var maxXFocus = xScaleFocus.range()[1];
		 
		 var minTimeFocus = xScaleFocus.domain()[0];
		 var maxTimeFocus = xScaleFocus.domain()[1];
		 
		 var timeInterval = imageAreaWidth*( maxTimeFocus - minTimeFocus)/ (maxXFocus - minXFocus);
		 
		 var mashedData=getMashedupDataRange(mainData, timeInterval,xScaleFocus.domain() );
		 
		 var averageCameraDistanceData ={};
		 
		 for(var i = 0; i< Object.keys(mashedData).length;i++)
		 {
			 var key = Object.keys(mashedData)[i];
			 var value = mashedData[key];
	 		var nameMap={};
	 		for(var j=0;j<value.length;j++)
	 		{
	 			var viewedObject = value[j];
	 			var name = viewedObject.name;
	 			if(!nameMap[name])
				{
	 				nameMap[name] = [0, 0];
				}
	 			var cameraDistance = parseFloat(viewedObject.cameraDistance);
	 			nameMap[name][0] += cameraDistance;
	 			nameMap[name][1]++;
	 		}
	 		//averageCameraDistanceData[key]=nameMap;
	 		// /*
	 		var maxOccurredName ="";
	 		var maxOccurrence=0;
	 		for(var k=0;k< Object.keys(nameMap).length;k++)
	 		{
	 			var name = Object.keys(nameMap)[k];
	 			var occurrence = nameMap[name][1];
	 			if(occurrence> maxOccurrence && nameMap[name][0] > 0)
	 			{
	 				maxOccurrence = occurrence;
	 				maxOccurredName = name;
	 			}
	 		}
	 		averageCameraDistanceData[key]={};
	 		averageCameraDistanceData[key][maxOccurredName]=nameMap[maxOccurredName];
	 		// */
		 }
				 
		 
		 var averageCameraDistanceKeys = Object.keys(averageCameraDistanceData);
		 
		 
		 var imageGroup = focus.append("g")
			.attr('class', 'image-area')
			;
		 
		 var timestampGroup= imageGroup.selectAll('g')
			.data(averageCameraDistanceKeys).enter()
			.append('g')
			.attr('id', function(key){ return 'T-'+key;});
		
		 var glyphGroup = timestampGroup.selectAll('g')		
			.data(function(key){ return Object.keys(averageCameraDistanceData[key]);})
		 .enter()
		 	.append('g')
		 	.attr('class', function(name){
				var timestamp = d3.select(this.parentNode).datum();
				var cameraDistanceData = averageCameraDistanceData[timestamp][name];
				var average = cameraDistanceData[0]/ cameraDistanceData[1];
				return "glyph-"+average;
			})
			.attr('transform',  function(name){
			var timestamp = d3.select(this.parentNode).datum();
			
			var x =(timestamp-minTimeFocus)*(maxXFocus - minXFocus) / ( maxTimeFocus - minTimeFocus);
			
			var cameraDistanceData = averageCameraDistanceData[timestamp][name];
			
			
			var y = heightFocus -(cameraDistanceData[0]/ cameraDistanceData[1])*heightFocus /maxY;
			
			var translateText = 'translate('+x+', '+y+')';
			return translateText;
		});
		 
		 glyphGroup
			.append('image')
			
			.attr('href', function(name)
					{						
						return imageData[name];
					})
					.attr('width', imageWidth)
			.attr('height', imageHeight)
			.attr('x',-imageAreaWidth/2)
			.attr('y', -imageAreaHeight/2);
		 
		 glyphGroup
			.append('title')
			.text(function(name){
				return "name:"+name;
			})		
			;
		 glyphGroup
			.append('circle')
			.attr('class', 'red-circle')
			.attr('cx', imageAreaWidth/2)
			.attr('cy', -imageAreaHeight/2)
			.attr('r', 5);
		glyphGroup
			.append('text')
			.attr('class', 'badge-text')
			.attr('x', 5)
			.attr('y', -5)
			.text(function(name){
				var timestamp = d3.select(this.parentNode.parentNode).datum();
				var cameraDistanceData = averageCameraDistanceData[timestamp][name];
				return cameraDistanceData[1]; 
			});
	 }
	 
	 // Context Region
	 
	 
	 var maxXContext = xScaleContext.range()[1];
	 var maxTimeContext = xScaleContext.domain()[1];
	 var timeInterval = imageAreaWidth* maxTimeContext/ maxXContext;
	 var mashedData=getMashedupData(mainData, timeInterval);
	 
	 var averageCameraDistanceData ={};
	 for(var i = 0; i< Object.keys(mashedData).length;i++)
	 {
		 var key = Object.keys(mashedData)[i];
		 var value = mashedData[key];
 		var nameMap={};
 		for(var j=0;j<value.length;j++)
 		{
 			var viewedObject = value[j];
 			var name = viewedObject.name;
 			if(!nameMap[name])
			{
 				nameMap[name] = [0, 0];
			}
 			else
			{
 				console.log('Hi'+", "+name+", "+key);	
			}
 			var cameraDistance = parseFloat(viewedObject.cameraDistance);
 			nameMap[name][0] += cameraDistance;
 			nameMap[name][1]++;
 		}
 		var maxOccurredName ="";
 		var maxOccurrence=0;
 		for(var k=0;k< Object.keys(nameMap).length;k++)
 		{
 			var name = Object.keys(nameMap)[k];
 			var occurrence = nameMap[name][1];
 			if(occurrence> maxOccurrence && nameMap[name][0] > 0)
 			{
 				maxOccurrence = occurrence;
 				maxOccurredName = name;
 			}
 			
 		}
 		
 		
 		averageCameraDistanceData[key]={};
 		averageCameraDistanceData[key][maxOccurredName]=nameMap[maxOccurredName];
	 }
			 
	 
	 var averageCameraDistanceKeys = Object.keys(averageCameraDistanceData);
	 
	 
	 var imageGroup = context.append("g")
		.attr('class', 'image-area');
	 
	 var timestampGroup= imageGroup.selectAll('g')
		.data(averageCameraDistanceKeys).enter()
		.append('g')
		.attr('id', function(key){ return 'T-'+key;});
	
	 var glyphGroup = timestampGroup.selectAll('g')		
		.data(function(key){ return Object.keys(averageCameraDistanceData[key]);})
	 .enter()
	 	.append('g')
	 	.attr('id', function(name){
			var timestamp = d3.select(this.parentNode).datum();
			var cameraDistanceData = averageCameraDistanceData[timestamp][name];
			var average = cameraDistanceData[0]/ cameraDistanceData[1];
			return "g-"+average;
		})
		.attr('transform', function(name)
				{
			var timestamp = d3.select(this.parentNode).datum();
			var x =( timestamp*maxXContext / maxTimeContext);
			
			
			var cameraDistanceData = averageCameraDistanceData[timestamp][name];
			
			
			var y = heightContext  -(cameraDistanceData[0]/ cameraDistanceData[1])*heightContext /maxY;
			
			
			var translateText ='translate('+x+','+y+')';
			return translateText;
		});
	glyphGroup
		.append('image')
		
		.attr('href', function(name)
				{						
					return imageData[name];
				})
				.attr('width', imageWidth)
		.attr('height', imageHeight)
		.attr('x', function(name)
				{					
					return -imageAreaWidth/2;
				})
		.attr('y', function(name)
		{
			
			return -imageAreaHeight/2;
		});
	
	glyphGroup		
		.append('title')
			.text(function(name)
					{
						return "name:"+name;
					})
					
		;
	
	glyphGroup
		.append('circle')
		.attr('class', 'red-circle')
		.attr('cx', imageAreaWidth/2)
		.attr('cy', -imageAreaHeight/2)
		.attr('r', 5);
	glyphGroup
		.append('text')
		.attr('class', 'badge-text')
		.attr('x', 5)
		.attr('y', -5)
		.text(function(name){
			var timestamp = d3.select(this.parentNode.parentNode).datum();
			var cameraDistanceData = averageCameraDistanceData[timestamp][name];
			return cameraDistanceData[1]; 
		});
	
	
	renderFocus();
	
	
	function brushed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore
																					// brush-by-zoom
		  var s = d3.event.selection || xScaleContext.range();
		  xScaleFocus.domain(s.map(xScaleContext.invert, xScaleContext));

		  focus.select(".axis--x").call(xAxisFocus);
		  svg.select(".zoom").call(zoomFocus.transform, d3.zoomIdentity
		      .scale(width / (s[1] - s[0]))
		      .translate(-s[0], 0));
		}

	function zoomed() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore
																					// zoom-by-brush
	  var t = d3.event.transform;
	  xScaleFocus.domain(t.rescaleX(xScaleContext).domain());
	  renderFocus();
	  focus.select(".axis--x").call(xAxisFocus);
	  context.select(".brush").call(brushContext.move, xScaleFocus.range().map(t.invertX, t));
	}
	
	function getMashedupData(data, interval)
	{
		var keys = Object.keys(data);
		var mashedData={};
		for(var i =0;i< keys.length; i++)
		 {
			 var key = keys[i];
			 var timestamp = getTimestamp(key);
			 var dataArray =  JSON.parse(data[key]);
			 var mashedKey = Math.floor(timestamp/interval) * interval;
			 
			 if(mashedData[mashedKey])
			 {
				 var previousArray =mashedData[mashedKey];
				 mashedData[mashedKey]= previousArray.concat(dataArray);
			 }
			 else
			 {
				 mashedData[mashedKey]= dataArray;
				 
			 }
		 }
		return mashedData;
	}
	
	function getMashedupDataRange(data, interval, range)
	{
		var keys = Object.keys(data);
		var mashedData={};
		for(var i =0;i< keys.length; i++)
		 {
			 var key = keys[i];
			 var timestamp = getTimestamp(key);
			 
			 if(range)
			 {
				 if(timestamp < range[0]) continue;
				 if(timestamp > range[1]) break;
			 }
			 
			 
			 var dataArray =  JSON.parse(data[key]);
			 var mashedKey = Math.floor(timestamp/interval) * interval;
			 
			 if(mashedData[mashedKey])
			 {
				 var previousArray =mashedData[mashedKey];
				 mashedData[mashedKey]= previousArray.concat(dataArray);
				 
			 }
			 else
			 {
				 mashedData[mashedKey]= dataArray;
			 }
		 }
		return mashedData;
	}
	d3.select('#zoomIn')
	.on('click', onZoomIn);
	d3.select('#zoomOut')
	.on('click', onZoomOut);
	function onZoomIn()
	{
		var rect = d3.select('rect.zoom');
		zoomFocus.scaleBy(rect, 1.1);
	}

	function onZoomOut()
	{
		var rect = d3.select('rect.zoom');
		zoomFocus.scaleBy(rect, 0.9);
	}
	
	
}
