function getLevitatedValue(value, levitation)
{
	return levitation+ value * (1-levitation);
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

function cleanupData(mashedData)
{
	var cleanMashedData ={};
	var lastTime =0;
	var currentTimeDiff =0;
	var itemBuffer ={};
	var currentItemBuffer ={};
	for(var i = 0; i< Object.keys(mashedData).length;i++)
	{
		var key = Object.keys(mashedData)[i];
		cleanMashedData[key] =[];
		
		
		var value = mashedData[key];
		
		for(var j=0;j<value.length;j++){
			var viewedObject = value[j];
			var name = viewedObject.name;
			
			var cameraDistance = getPropertyValue(viewedObject, 'cameraDistance');
			var timestamp = getPropertyValue(viewedObject,'T');

			if(cameraDistance > minimumCameraDistance)
			{
				
				
				if(timestamp > lastTime)
				{
					for(var keyIndex=0;keyIndex<Object.keys(itemBuffer).length;keyIndex++)
					{
						var keyName = Object.keys(itemBuffer)[keyIndex];
						if(currentItemBuffer[keyName]){
							currentItemBuffer[keyName]['items'] 
							= itemBuffer[keyName]['items']
								.concat(currentItemBuffer[keyName]['items'] );
							currentItemBuffer[keyName]['time'] += itemBuffer[keyName]['time'];
						}
					}	
					for(var keyIndex=0;keyIndex<Object.keys(currentItemBuffer).length;keyIndex++)
					{
						var keyName = Object.keys(currentItemBuffer)[keyIndex];
						
						var time = currentItemBuffer[keyName]['time'];
						
						if(time > eyeResponseTime){
							cleanMashedData[key] = cleanMashedData[key].concat(currentItemBuffer[keyName]['items']);
							delete currentItemBuffer[keyName];
						}							
					}
					
					itemBuffer = currentItemBuffer;
					currentItemBuffer = {};		
					currentTimeDiff = timestamp - lastTime;
					lastTime = timestamp;
				}
				
				viewedObject['hazardViewTime'] = 0;
				viewedObject['viewTime'] = currentTimeDiff;
				if(hazardData[name])
				{
					for(var l=0;l<hazardData[name].length;l++)
					{
						var hazardObject = hazardData[name][l];
						if(timestamp>= hazardObject.startTime && timestamp<=hazardObject.endTime)
						{
							viewedObject['hazardViewTime'] = currentTimeDiff;
							viewedObject['hazardTypeSet'] =  hazardObject.hazardType;
							break;
						}
					}
				}
				
				if(!currentItemBuffer[name])
				{
					currentItemBuffer[name] ={items:[], time:0}
				}
				currentItemBuffer[name]['items'].push(viewedObject);
				currentItemBuffer[name]['time'] = currentTimeDiff;
				
			}
			else if(timestamp > lastTime){
				currentTimeDiff = timestamp - lastTime;
				lastTime = timestamp;
			}
			
		}
			
			
		
	 }
	return cleanMashedData;
}


/*
 * returns aggregatedData ={ <timeStamp>:{items:{<name>:{count, prop1: , prop2: ... }}
 * , aggregate:{count, prop1: , prop2: ... }}
 * */
function getAggregatedData(mashedData,itemCount, sortAscending, sortingProperty , filter)
{	
	var aggregatedData ={};
	var aggregatePropertyKeys = Object.keys(aggregateProperties);
	 for(var i = 0; i< Object.keys(mashedData).length;i++)
	 {
		 var key = Object.keys(mashedData)[i];
		 var value = mashedData[key];
		var nameMap={};
		var aggregate ={};
		for(var j=0;j<value.length;j++)
		{
			var viewedObject = value[j];
			var name = viewedObject.name;
			
			var filterValue = getDenormalizedFilterValue(filter, sortingProperty);
			var sortingPropertyValue = getPropertyValue(viewedObject, sortingProperty);
			if(sortingPropertyValue < filterValue.min || sortingPropertyValue > filterValue.max)
			{
				continue;
			}

			
			
			if(!nameMap[name])
			{
				nameMap[name] = {'count':0};			
				if(aggregatePropertyKeys)
				{
					for(var propertyIndex=0
							;propertyIndex<aggregatePropertyKeys.length 
							;propertyIndex++) 
					{
						var propertyName = aggregatePropertyKeys[propertyIndex];
						if(aggregateProperties[propertyName].type === 'float'){
							nameMap[name][propertyName] =0;
							aggregate[propertyName] =0;
						}else if(aggregateProperties[propertyName].type === 'list'){
							nameMap[name][propertyName] =[];
							aggregate[propertyName] =[];
						}
							
					}
				}
			}
			
			
			if(aggregatePropertyKeys)
			{
				for(var propertyIndex=0
						;propertyIndex<aggregatePropertyKeys.length 
						;propertyIndex++) 
				{
					var propertyName = aggregatePropertyKeys[propertyIndex];
					var propertyValue = getPropertyValue(viewedObject, propertyName);
					
					if(propertyValue != null){
						if(aggregateProperties[propertyName].type === 'list') {
							if(!nameMap[name][propertyName].includes(propertyValue)){							
								nameMap[name][propertyName].push(propertyValue);
							}
							if(!aggregate[propertyName].includes(propertyValue)){							
								aggregate[propertyName].push(propertyValue);
							}
							
						}else{
							nameMap[name][propertyName] += propertyValue;
							aggregate[propertyName]+=propertyValue;
						}

					}
										
				}
				
			}
			
			
			
			nameMap[name].count++;
			aggregate.count++;
		}	
		
		if(itemCount && itemCount > 0)
		{
			var sortedNameMapKeys = Object.keys(nameMap);
			sortedNameMapKeys.sort(function(a,b){
					if(nameMap[a] && nameMap[b])
					{	
						var itemA = nameMap[a]['count'];
						var itemB = nameMap[b]['count'];
						if(sortingProperty && sortingProperty != 'count')
						{
							// sort over average property value
							if(aggregateProperties[sortingProperty].sortingValue === 'average'){
								itemA = nameMap[a][sortingProperty]/ nameMap[a]['count'];
								itemB = nameMap[b][sortingProperty]/ nameMap[b]['count'];
							}
							else if(aggregateProperties[sortingProperty].sortingValue === 'sum'){
								itemA = nameMap[a][sortingProperty];
								itemB = nameMap[b][sortingProperty];
							}
							else if(aggregateProperties[sortingProperty].sortingValue === 'size'){
								itemA = nameMap[a][sortingProperty].length;
								itemB = nameMap[b][sortingProperty].length;
							}
							
						}
						if(!sortAscending)
						{
							return itemB - itemA;
						}
						else
						{
							return itemA - itemB;
						}
						
												
						
					}
					else 
					{
						return 0;
					}
					
			});
			sortedNameMapKeys = sortedNameMapKeys.slice(0, Math.min(sortedNameMapKeys.length,itemCount ))
			
			aggregatedData[key]={items:{}, aggregate:{}};
			aggregatedData[key].aggregate={};
			
			for(var k =0;k<sortedNameMapKeys.length;k++)
			{
				name = sortedNameMapKeys[k];
				aggregatedData[key].items[name]=nameMap[name];
				var properties = Object.keys(nameMap[name]);
				for(var l =0;l<properties.length;l++)
				{
					if(!aggregatedData[key].aggregate[properties[l]])
					{
						aggregatedData[key].aggregate[properties[l]] =0;
					}
					
					aggregatedData[key].aggregate[properties[l]]+=nameMap[name][properties[l]];					
				}
				
				
			}

		}
		else
		{
			aggregatedData[key]={items:nameMap, aggregate:aggregate};
			
		}
		
	 }
	 
	 return aggregatedData;
}

function getShowValue(data, property){
	if(property == 'count'){
		return data.count;
	} else if(property == 'hazardViewTime'){
		return (100.0 * data.hazardViewTime / data.viewTime).toFixed(2)+"%";
	}else if(property == 'viewTime'){
		return data.viewTime.toFixed(2);
	}else if(property == 'hazardTypeSet'){
		return JSON.stringify(data.hazardTypeSet);
	}
	else{
		return (data[property] / data.count / getMax(property)).toFixed(2);
	}
}

function filterStarplotAttributes(attributes){	
	//remove count and remove non star plot attributes
	for(var i=0;i<attributes.length;i++){
		if(attributes[i] === 'count' || !aggregateProperties[attributes[i]].starplot){
			attributes.splice(i,1);
		}
	}
	
	return attributes;
}
function getDenormalizedFilterValue(filter, propertyName)
{
	return {min:filter.min * getMax(propertyName), max:filter.max * getMax(propertyName)};
}

function getMax(propertyName)
{
	return propertyMax[propertyName];
}
function getMin(propertyName)
{
	return propertyMin[propertyName];
}

function getPropertyValue(data, propertyName)
{
	if(!data[propertyName]){
		return null;
	}
	else if(propertyName ==='cameraDistance')
	{
		return parseFloat(data[propertyName]);
	}
	else if (propertyName ==='size')
	{
		var textData = data[propertyName];
		var regExp = /\((\d*),\s*(\d*)\)/;
		var parseData = regExp.exec(textData);
		
		if(parseData && parseData.length > 2)
		{
			var width = parseData[1];
			var height =parseData[2];
			return width * height;
		}
		else
		{
			return 0;
		}
	}
	else if(propertyName ==='center')
	{
		var textData = data[propertyName];
		var regExp = /\((\d*),\s*(\d*)\)/;
		var parseData = regExp.exec(textData);
		
		if(parseData && parseData.length > 2)
		{
			var x = parseData[1];
			var y =parseData[2];
			var screenCenterX = 960;
			var screenCenterY = 540;
			return Math.sqrt(
					(x-screenCenterX)*(x-screenCenterX) 
					+ (y-screenCenterY)*(y-screenCenterY));
		}
		else
		{
			return 2500; // sqrt(960^2+540^2) = 1101
		}
	}
	else
	{
		return parseFloat(data[propertyName]);
	}
}
function getShare(data, itemName, propertyName)
{
	return data.items[itemName][propertyName] /data.aggregate[propertyName] ;
}
function colores_google(n) {
	  var colores_g = [
		  "#3366cc", "#dc3912", "#ff9900", "#109618",
		  "#990099", "#0099c6", "#dd4477", "#66aa00", 
		  "#b82e2e", "#316395", "#994499", "#22aa99", 
		  "#aaaa11", "#6633cc", "#e67300", "#8b0707", 
		  "#651067", "#329262", "#5574a6", "#3b3eac"];
	  return colores_g[n % colores_g.length];
	}
