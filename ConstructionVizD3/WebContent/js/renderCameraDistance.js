function renderContext(context, xScaleContext, heightContext,maxY)
{
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