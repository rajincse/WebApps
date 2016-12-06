var itemCount =10;
var sortingProperty = 'cameraDistance';
function renderContext(context, xScaleContext, heightContext,maxY)
{
	 var maxXContext = xScaleContext.range()[1];
	 var maxTimeContext = xScaleContext.domain()[1];
	 var timeInterval = imageAreaWidth* maxTimeContext/ maxXContext;
	 var mashedData=getMashedupData(mainData, timeInterval);
	 
	 var aggregated = getAggregatedData(mashedData,itemCount, true, sortingProperty);
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
			var share = 100*getShare(aggregated[timestamp], name, sortingProperty);
			return "g-"+share;
		})		
		.attr('transform', function(name){
			var timestamp = d3.select(this.parentNode).datum();
			
			var height = heightContext*getShare(aggregated[timestamp], name, sortingProperty);
			
			var x =( timestamp*maxXContext / maxTimeContext);
			
			
			if(timestamp > lastTime)
			{
				lastTime = timestamp;
				lastY =0;
			}
			
			
			var translateText ='translate('+x+','+lastY+')';
			var y = lastY+height;
			lastY = y;
			
			
			
			return translateText;
		});
	glyphGroup
		.append('rect')
		.attr('class', 'glyph-rect')
		.attr('width', imageWidth)
		.attr('height', function(name)
				{
					var timestamp = d3.select(this.parentNode.parentNode).datum();					
					var h = heightContext * getShare(aggregated[timestamp], name, sortingProperty);
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
						var timestamp = d3.select(this.parentNode.parentNode).datum();						
						var share = 100*getShare(aggregated[timestamp], name, sortingProperty);
				
						return "name:"+name+', share:'+share.toFixed(2)+'%';
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
	 
	 var aggregated = getAggregatedData(mashedData,itemCount, true, sortingProperty);
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
			
			var share = 100*getShare(aggregated[timestamp], name, sortingProperty);
			return "g-"+share.toFixed(2)+'%';
		})		
		.attr('transform', function(name)
				{
			var timestamp = d3.select(this.parentNode).datum();
			
			var height = heightFocus*getShare(aggregated[timestamp], name, sortingProperty);
			
			var x =(timestamp-minTimeFocus)*(maxXFocus - minXFocus) / ( maxTimeFocus - minTimeFocus);
			
			
			if(timestamp > lastTime)
			{
				lastTime = timestamp;	
				lastY = 0;
			}
			
			var translateText ='translate('+x+','+lastY+')';
			
			var y = lastY+height;
			lastY = y;
			
			
			
			return translateText;
		});
	glyphGroup
		.append('rect')
		.attr('class', 'glyph-rect')
		.attr('width', imageWidth)
		.attr('height', function(name)
				{
					var timestamp = d3.select(this.parentNode.parentNode).datum();
					var h = heightFocus * getShare(aggregated[timestamp], name, sortingProperty);
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
						var timestamp = d3.select(this.parentNode.parentNode).datum();						
						var share = 100*getShare(aggregated[timestamp], name, sortingProperty);
				
						return "name:"+name+', share:'+share.toFixed(2)+'%';
					})
					
		;
	var icon = glyphGroup.append('g')
					.attr('class','icon')
					.attr('transform', function(name)
							{
								var timestamp = d3.select(this.parentNode.parentNode).datum();
								var share = 7*getShare(aggregated[timestamp], name, sortingProperty);
								return 'scale('+share+')';
							});
							
	icon	
		.append('image')
		
		.attr('href', function(name)
				{						
					return imageData[name];
				})
				.attr('width', imageWidth/2)
		.attr('height', imageHeight/2)
		.attr('x',imageAreaWidth/4)
		.attr('y', imageAreaHeight/4);
	icon
		.append('circle')
		.attr('class', 'red-circle')
		.attr('cx', 3* imageAreaWidth/4)
		.attr('cy', imageAreaHeight/4)
		.attr('r', 5);
	icon
		.append('text')
		.attr('class', 'badge-text')
		.attr('x', 3* imageAreaWidth/4-3)
		.attr('y',10)
		.text(function(name){
			var timestamp = d3.select(this.parentNode.parentNode.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name].count;
			return aggredatedDataOccurrence; 
		});
}