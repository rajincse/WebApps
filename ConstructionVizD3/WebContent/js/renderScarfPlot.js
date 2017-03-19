
var displayProperties ={
		'size': { 'color': '#ff0000'}, 
		'center':{ 'color':'#00ff00'}, 
		'viewed':{ 'color':'#0000ff'}, 
		'rotationSpeed':{ 'color':'#58E87F'}, 
		'translationSpeed':{ 'color':'#b25221'},
		'cameraDistance': { 'color':'ff00ff'},
		'hazard': { 'color':'ff00ff'}
};

function renderGlyphGuide()
{
	var svg =d3.select('#legendSVG');
	var width = 320;
	var height = 320;
	
	svg.attr('width', width);
	svg.attr('height', height);
	
	var centerX = width /2;
	var centerY = height /2;
	var radiusX =width /2;
	var radiusY =height /2;
	
	var attributes = Object.keys(displayProperties);
	var lineData =[];
	var thetaDiff =Math.PI * 2 / attributes.length;
	
	for(var i=0;i< attributes.length;i++)
	{
		var attributeName =attributes[i];
		var theta = thetaDiff * i;
		var x = centerX+radiusX * Math.cos(theta);
		var y = centerY + radiusY * Math.sin(theta);
		lineData.push( {'attribute':attributeName, 'x1':centerX,'y1':centerY,'x2':x, 'y2': y});
	}
	
	var guide = svg.append('g')
		.attr('class', 'guide');
	
	guide.selectAll('line')
	.data( lineData)
		.enter()
		.append('line')
		.attr('class', 'starplot-axes')
		.attr('attribute-name', function(d){ return d.attribute;})
		.attr('x1', function(d){ return d.x1;})
		.attr('y1', function(d){ return d.y1;})
		.attr('x2', function(d){ return d.x2;})
		.attr('y2', function(d){ return d.y2;})
		.style('stroke', function(d){return displayProperties[d.attribute].color; })
	
	guide
		.selectAll('text')
		.data(lineData)
		.enter()
		.append('text')
		.attr('class', 'label')
		.text( function (l) { return l.attribute;})
		.attr('x', function(l) { return (l.x1 *1+l.x2 *3)/4;})
		.attr('y', function(l) { return (l.y1 * 1+l.y2 * 3)/4;})
	
}
function renderContext(context, xScaleContext, heightContext, sortingProperty, sortAscending, filter)
{
	 var maxXContext = xScaleContext.range()[1];
	 var maxTimeContext = xScaleContext.domain()[1];
	 var timeInterval = imageAreaWidth* maxTimeContext/ maxXContext;
	 
	renderScarfplot(context,0,maxXContext, 0,maxTimeContext, heightContext,  sortingProperty, sortAscending, filter);
	 
}
function renderFocus(focus, xScaleFocus, heightFocus, sortingProperty, sortAscending, filter)
{
	d3.select(focus).node().selectAll('g.image-area').remove();
	 
	 var minXFocus = xScaleFocus.range()[0];
	 var maxXFocus = xScaleFocus.range()[1];
	 
	 var minTimeFocus = xScaleFocus.domain()[0];
	 var maxTimeFocus = xScaleFocus.domain()[1];
	 renderScarfplot(focus,minXFocus,maxXFocus, minTimeFocus,maxTimeFocus, heightFocus,  sortingProperty, sortAscending, filter);	 
	 
}
function renderScarfplot(area,minX,maxX, minTime,maxTime, heightArea, sortingProperty, sortAscending, filter)
{
	 var timeInterval = imageAreaWidth* (maxTime-minTime)/ (maxX-minX);
	 
	 var mashedData=getMashedupDataRange(mainData, timeInterval,[minTime,maxTime] );
	 var mashedData = cleanupData(mashedData);
	 var itemCount =  Math.floor(heightArea/ imageAreaHeight);
	 
	 var aggregated = getAggregatedData(mashedData,itemCount, sortAscending, sortingProperty,Object.keys(displayProperties), filter);
	 
	 var aggregatedKeys = Object.keys(aggregated);
	 
	 
	 var imageGroup = area.append("g")
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
	 	.attr('name', function(name){
			return "g-"+name;
		})		
		.attr('transform', function(name){
			var timestamp =parseFloat( d3.select(this.parentNode).datum());			
			
			var height = heightArea / itemCount;
			var x =(timestamp-minTime)*(maxX - minX) / ( maxTime - minTime);
			
			
			if(timestamp != lastTime)
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
		.append('title')
			.text(function(name)
					{						
						var timestamp = d3.select(this.parentNode.parentNode).datum();						
						var data =aggregated[timestamp].items[name];
						var showData = {};
						var properties = Object.keys(data); 
						for(var i= 0;i<properties.length;i++)
						{
							if(properties[i] != 'count')
							{
								showData[properties[i]] = (data[properties[i]] / data.count / getMax(properties[i])).toFixed(2); 
							}
						}
						
						var jsonData = JSON.stringify(showData);
						
						return "name:"+name
						+', count:'+ data.count
						+', time:'+timestamp
						+', interval:'+timeInterval
						+', data:'+jsonData;
					})
					
		;
	renderIcon(glyphGroup, aggregated, filter, timeInterval);
}
function getOpacity(name, aggregated, filter, timestamp)
{
	var item = aggregated[timestamp].items[name];
	var aggregate = aggregated[timestamp].aggregate;
	
	var averageViewed = item.viewed/ item.count;
	var opacity =0;
	if( averageViewed < filter.viewRadius)
	{	
		var n = filter.viewRadius * item.count - item.viewed;
		var dn = filter.viewRadius * aggregate.count - aggregate.viewed;
		
		opacity = n/dn;
	}
	return opacity;
}

function renderIcon(glyphGroup, aggregated, filter, timeInterval)
{
	var preferredViewCount = 
		Math.max(1,
			Math.min(
					Math.floor(attentionSpan/eyeResponseTime),
					Math.floor(timeInterval/ eyeResponseTime)
			)
		);
	
	glyphGroup
//	.style('opacity', function(name)
//			{	
//				var timestamp = d3.select(this.parentNode).datum();
//				var item = aggregated[timestamp].items[name];
//				var normalizedViewed =item.cameraDistance/ item.count/ getMax('cameraDistance');
//				var opacity = 1- normalizedViewed * normalizedViewed ;
//
//				return opacity;
//			})
	.attr('transform', function(name)
			{
					var transform = d3.select(this).attr('transform');
					
					var timestamp = d3.select(this.parentNode).datum();
					var item = aggregated[timestamp].items[name];			
					var cameraDistance = item.cameraDistance / item.count;
					var minScale =0.55;
					var scale = minScale + (1-minScale) *(1- ( cameraDistance/ getMax('cameraDistance'))) ;
					
					transform+= 'scale('+scale+','+scale+')';
					return transform;
			})
	;
	
	var icon = glyphGroup.append('g')
	.attr('class','icon');

	icon
	.append('rect')
	.attr('style', function(name)
		{
			var style ="fill:none";
			var timestamp = d3.select(this.parentNode.parentNode.parentNode).datum();
			var item = aggregated[timestamp].items[name];
			if(item.hazard >=viewedWindowSize)
			{
				style ="fill: red";
			}
			
			return style;
		})	
		.attr('width', imageWidth)
		.attr('height', imageHeight)
		.attr('x',imageAreaWidth /2 - imageWidth/2)
		.attr('y', imageAreaHeight/2 - imageHeight/2)
	
	
	icon	
	.append('image')
		.attr('class', 'glyph-image')
		.attr('href', function(name)
			{						
				if(imageData[name])
					return imageData[name];
				else
					return 'images/default.png';
			})
		.attr('width', imageWidth)
		.attr('height', imageHeight)
		.attr('x',imageAreaWidth /2 - imageWidth/2)
		.attr('y', imageAreaHeight/2 - imageHeight/2)
		.attr('preserveAspectRatio','none')
		;
	
	if(filter.renderStarPlot)
	{
		icon
		.append('path')
		.attr('class', 'starplot-value')
		.attr('d', function(name)
				{
					var timestamp = d3.select(this.parentNode.parentNode.parentNode).datum();
					var item = aggregated[timestamp].items[name];
					var data = '';
					
					var centerX = imageAreaWidth /2;
					var centerY = imageAreaHeight /2;
					var radiusX =imageAreaWidth /2;
					var radiusY =imageAreaHeight /2;
					
					
					var attributes = Object.keys(item);
					//remove count
					var countIndex = attributes.indexOf('count');				
					attributes.splice(countIndex,1);
					
					
					var thetaDiff =Math.PI * 2 / attributes.length;
					
				
					for(var i =0;i<attributes.length;i++)
					{
						var attributeName =attributes[i];						
						
						var avgValue = item[attributeName]	/item.count;
						var maxValue= getMax(attributeName);
						var value = 	avgValue /maxValue; //normalized		
						
						
						if(!value) value =0;
						
						value = getLevitatedValue(value, levitation);
						
						var theta = thetaDiff * i;
						
						if( i==0)
						{
							var x = centerX+radiusX *value;
							var y = centerY;
							data+= 'M '+x+' '+y+' ';
						}
						else
						{
							var x = centerX+radiusX *value * Math.cos(theta);
							var y = centerY + radiusY *value * Math.sin(theta);
							data+= 'L '+x+' '+y+' ';
						}
						
					}
					data+= 'Z';
					return data;
				})
				;
			
		icon
			.selectAll('circle')
			.data( function(name)
				{
					var timestamp = d3.select(this.parentNode.parentNode).datum();
					var item = aggregated[timestamp].items[name];
					
					var data =[];
					
					var centerX = imageAreaWidth /2;
					var centerY = imageAreaHeight /2;
					var radiusX =imageAreaWidth /2;
					var radiusY =imageAreaHeight /2;
					
					
					var attributes = Object.keys(item);
					attributes.splice(0,1);
					var thetaDiff =Math.PI * 2 / attributes.length;
					
				
					for(var i =0;i<attributes.length;i++)
					{
						var attributeName =attributes[i];						
						
						var avgValue = item[attributeName]	/item.count;
						var maxValue= getMax(attributeName);
						var value = 	avgValue /maxValue; //normalized		
						
						if(!value) value =0;
						value = getLevitatedValue(value, levitation);
						
						var theta = thetaDiff * i;
						
						var x = centerX+radiusX *value * Math.cos(theta);
						var y = centerY + radiusY *value * Math.sin(theta);
						data.push({'attribute':attributeName, 'x':x, 'y':y});
						
						
					}
					
					return data;
					
				})	
			.enter()
			.append('circle')
			.attr('attribute-name', function(d){ return d.attribute;})
			.attr('class', 'attribute-circle')
			.attr('r', 2)
			.attr('cx', function(d){return d.x;})
			.attr('cy', function(d){ return d.y;})
			.style( 'fill',function(d){
					return displayProperties[d.attribute];
				});
		
		icon
			.selectAll('line')
			.data( function(name)
					{
						var timestamp = d3.select(this.parentNode.parentNode).datum();
						var item = aggregated[timestamp].items[name];
						var data = '';
						
						var centerX = imageAreaWidth /2;
						var centerY = imageAreaHeight /2;
						var radiusX =imageAreaWidth /2;
						var radiusY =imageAreaHeight /2;
						
						var data =[];
				
						var attributes = Object.keys(item);
						attributes.splice(0,1);
						var thetaDiff =Math.PI * 2 / attributes.length;
						
						for(var i=0;i< attributes.length;i++)
						{
							var attributeName =attributes[i];
							var theta = thetaDiff * i;
							var x = centerX+radiusX * Math.cos(theta);
							var y = centerY + radiusY * Math.sin(theta);
							data.push( {'attribute':attributeName, 'x1':centerX,'y1':centerY,'x2':x, 'y2': y});
						}
						return data;
					})
				.enter()
				.append('line')
				.attr('class', 'starplot-axes')
				.attr('attribute-name', function(d){ return d.attribute;})
				.attr('x1', function(d){ return d.x1;})
				.attr('y1', function(d){ return d.y1;})
				.attr('x2', function(d){ return d.x2;})
				.attr('y2', function(d){ return d.y2;})
				.style('stroke', function(d){return displayProperties[d.attribute].color; })
				;
		
		
	}
			
			
	
	icon
		.append('circle')
		.attr('class', 'red-circle')
		.attr('cx', 3* imageAreaWidth/4)
		.attr('cy', imageAreaHeight/4)
		.attr('r', 5);
	icon
		.append('text')
		.attr('class', 'badge-text')
		.attr('text-anchor', 'middle')
		.attr('x', 3* imageAreaWidth/4)
		.attr('y',imageAreaHeight/4+3)
		.text(function(name){
			var timestamp = d3.select(this.parentNode.parentNode.parentNode).datum();
			var aggredatedDataOccurrence = aggregated[timestamp].items[name].count;
			return aggredatedDataOccurrence; 
		});
}