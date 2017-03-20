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
	for(var i = 0; i< Object.keys(mashedData).length;i++)
	{
		var key = Object.keys(mashedData)[i];
		cleanMashedData[key] =[];
		var temp=[];
		var lastName ="";
		
		
		var value = mashedData[key];
		
		for(var j=0;j<value.length;j++){
			var viewedObject = value[j];
			var name = viewedObject.name;
			
			var cameraDistance = getPropertyValue(viewedObject, 'cameraDistance');
			
			if(cameraDistance > minimumCameraDistance)
			{
				viewedObject['hazard'] = 0;
				var timestamp = getPropertyValue(viewedObject,'T');
				if(hazardData[name])
				{
					for(var l=0;l<hazardData[name].length;l++)
					{
						var hazardObject = hazardData[name][l];
						if(timestamp>= hazardObject.startTime && timestamp<=hazardObject.endTime)
						{
							viewedObject['hazard'] = 1;
							break;
						}
					}
				}
				
				if(temp.length ==0)
				{
					lastName = name;
					temp.push(viewedObject);
				}
				else if(temp.length < viewedWindowSize)
				{
					if(name !== lastName)
					{
						temp =[];
						lastName = name;
					}
					temp.push(viewedObject);
				}	
				else {
					cleanMashedData[key]= cleanMashedData[key].concat(temp);
					temp =[];
				}
				
			}
			
		}
			
			
		
	 }
	return cleanMashedData;
}


/*
 * returns aggregatedData ={ <timeStamp>:{items:{<name>:{count, prop1: , prop2: ... }}
 * , aggregate:{count, prop1: , prop2: ... }}
 * */
function getAggregatedData(mashedData,itemCount, sortAscending, sortingProperty , displayProperties, filter)
{	
	var aggregatedData ={};
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
				if(displayProperties)
				{
					for(var propertyIndex=0
							;propertyIndex<displayProperties.length 
							;propertyIndex++) 
					{
						var propertyName = displayProperties[propertyIndex];
						nameMap[name][propertyName] =0;
						aggregate[propertyName] =0;	
					}
				}
			}
			
			
			if(displayProperties)
			{
				for(var propertyIndex=0
						;propertyIndex<displayProperties.length 
						;propertyIndex++) 
				{
					var propertyName = displayProperties[propertyIndex];
					var propertyValue = getPropertyValue(viewedObject, propertyName);
					
					nameMap[name][propertyName] += propertyValue;
					aggregate[propertyName]+=propertyValue;
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
						if(sortingProperty)
						{
							// sort over average property value
							itemA = nameMap[a][sortingProperty]/ nameMap[a]['count'];
							itemB = nameMap[b][sortingProperty]/ nameMap[b]['count'];
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
	if(propertyName ==='cameraDistance')
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
