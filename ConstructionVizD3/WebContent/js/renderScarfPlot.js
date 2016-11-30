var itemCount =10;
function renderContext(context, xScaleContext, heightContext,maxY)
{
	 var maxXContext = xScaleContext.range()[1];
	 var maxTimeContext = xScaleContext.domain()[1];
	 var timeInterval = imageAreaWidth* maxTimeContext/ maxXContext;
	 var mashedData=getMashedupData(mainData, timeInterval);
	 
	 var aggregated = getAggregatedData(mashedData,itemCount);
	 var aggregatedKeys = Object.keys(aggregated);
	 
	 
	 var imageGroup = context.append("g")
		.attr('class', 'image-area');
	 
	 var timestampGroup= imageGroup.selectAll('g')
		.data(aggregatedKeys).enter()
		.append('g')
		.attr('id', function(key){ return 'T-'+key;});
	
	 var lastY =-1;
	 var lastTime =-1;
	 var glyphGroup = timestampGroup.selectAll('g')		
		.data(function(key){ return Object.keys(aggregated[key].items);})
	 .enter()
	 	.append('g')
	 	.attr('id', function(name){
			var timestamp = d3.select(this.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
			var share = 100*aggredatedDataOccurrence/ aggregated[timestamp].aggregate[1];
			return "g-"+share;
		})
		.attr('class', 'glyph')
		.attr('transform', function(name)
				{
			var timestamp = d3.select(this.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
			var height = heightContext*aggredatedDataOccurrence/ aggregated[timestamp].aggregate[1];
			
			var x =( timestamp*maxXContext / maxTimeContext);
			
			
			if(timestamp > lastTime)
			{
				lastTime = timestamp;
				lastY =-height;
			}
			
			
			
			var y = lastY+height;
			lastY = y;
			
			
			var translateText ='translate('+x+','+y+')';
			return translateText;
		});
	glyphGroup
		.append('rect')
		.attr('class', 'glyph-rect')
		.attr('width', imageWidth)
		.attr('height', function(name)
				{
					var timestamp = d3.select(this.parentNode.parentNode).datum();
					var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
					var h = heightContext * aggredatedDataOccurrence/ aggregated[timestamp].aggregate[1];
					return h; 
				})				
		.attr('x',0)
		.attr('y', 0)
		.attr('fill', function(name){ return colorData[name];})
		;
	
	glyphGroup		
		.append('title')
			.text(function(name)
					{
						return "name:"+name;
					})
					
		;
	
	
//	glyphGroup
//		.append('circle')
//		.attr('class', 'red-circle')
//		.attr('cx', imageAreaWidth/2)
//		.attr('cy', -imageAreaHeight/2)
//		.attr('r', 5);
//	glyphGroup
//		.append('text')
//		.attr('class', 'badge-text')
//		.attr('x', 5)
//		.attr('y', -5)
//		.text(function(name){
//			var timestamp = d3.select(this.parentNode.parentNode).datum();
//			var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
//			return aggredatedDataOccurrence; 
//		});
}
function renderFocus(focus, xScaleFocus, heightFocus, maxY)
{
	d3.select(focus).node().selectAll('g.image-area').remove();
	 
	 var minXFocus = xScaleFocus.range()[0];
	 var maxXFocus = xScaleFocus.range()[1];
	 
	 var minTimeFocus = xScaleFocus.domain()[0];
	 var maxTimeFocus = xScaleFocus.domain()[1];
	 
	 var timeInterval = imageAreaWidth*( maxTimeFocus - minTimeFocus)/ (maxXFocus - minXFocus);
	 
	 var mashedData=getMashedupDataRange(mainData, timeInterval,xScaleFocus.domain() );
	 
	 var aggregated = getAggregatedData(mashedData,itemCount);
	 var aggregatedKeys = Object.keys(aggregated);
	 
	 
	 var imageGroup = focus.append("g")
		.attr('class', 'image-area')
		;
	 
	 var timestampGroup= imageGroup.selectAll('g')
		.data(aggregatedKeys).enter()
		.append('g')
		.attr('id', function(key){ return 'T-'+key;});
	
	 var lastY =-1;
	 var lastTime =-1;
	
	 var glyphGroup = timestampGroup.selectAll('g')		
	 .data(function(key){ return Object.keys(aggregated[key].items);})
	 .enter()
	 	.append('g')
	 	.attr('id', function(name){
			var timestamp = d3.select(this.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
			var share = 100*aggredatedDataOccurrence/ aggregated[timestamp].aggregate[1];
			return "g-"+share;
		})
		
		.attr('transform', function(name)
				{
			var timestamp = d3.select(this.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
			var height = heightFocus*aggredatedDataOccurrence/ aggregated[timestamp].aggregate[1];
			
			var x =(timestamp-minTimeFocus)*(maxXFocus - minXFocus) / ( maxTimeFocus - minTimeFocus);
			
			
			if(timestamp > lastTime)
			{
				lastTime = timestamp;	
				lastY = -height;
			}
			
			
			
			var y = lastY+height;
			lastY = y;
			
			
			var translateText ='translate('+x+','+y+')';
			return translateText;
		});
	glyphGroup
		.append('rect')
		.attr('class', 'glyph-rect')
		.attr('width', imageWidth)
		.attr('height', function(name)
				{
					var timestamp = d3.select(this.parentNode.parentNode).datum();
					var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
					var h = heightFocus * aggredatedDataOccurrence/ aggregated[timestamp].aggregate[1];
					return h; 
				})				
		.attr('x',0)
		.attr('y', 0)
		.attr('fill', function(name){ return colorData[name];})
		;
	
	glyphGroup		
		.append('title')
			.text(function(name)
					{
						return "name:"+name;
					})
					
		;
	glyphGroup
		.append('image')
		
		.attr('href', function(name)
				{						
					return imageData[name];
				})
				.attr('width', imageWidth/2)
		.attr('height', imageHeight/2)
		.attr('x',imageAreaWidth/4)
		.attr('y', imageAreaHeight/4);
	glyphGroup
		.append('circle')
		.attr('class', 'red-circle')
		.attr('cx', 3* imageAreaWidth/4)
		.attr('cy', imageAreaHeight/4)
		.attr('r', 5);
	glyphGroup
		.append('text')
		.attr('class', 'badge-text')
		.attr('x', 3* imageAreaWidth/4-3)
		.attr('y',10)
		.text(function(name){
			var timestamp = d3.select(this.parentNode.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name][1];
			return aggredatedDataOccurrence; 
		});
}