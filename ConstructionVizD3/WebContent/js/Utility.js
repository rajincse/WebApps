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

/*
 * returns aggregatedData ={ <timeStamp>:{items:{<name>:{count, prop1: , prop2: ... }}
 * , aggregate:[<aggregatedPropertyValue>, <aggregatedOccurrenceValue]}
 * */
function getAggregatedData(mashedData,itemCount, sortAscending, propertyName , additionalProperties)
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
			if(!nameMap[name])
			{
				nameMap[name] = {'count':0};
				aggregate[propertyName] ={'count':0};
				if(propertyName)
				{
					nameMap[name][propertyName] =0;
					aggregate[propertyName] =0;				
				}
				if(additionalProperties)
				{
					for(var additionalPropertyIndex=0
							;additionalPropertyIndex<additionalProperties.length 
							;additionalPropertyIndex++) 
					{
						var additionalPropertyName = additionalProperties[additionalPropertyIndex];
						nameMap[name][additionalPropertyName] =0;
						aggregate[additionalPropertyName] =0;	
					}
				}
			}
			if(propertyName)
			{
				var propertyValue = parseFloat(viewedObject[propertyName]);
				
				nameMap[name][propertyName] += propertyValue;
				aggregate[propertyName]+=propertyValue;
			}
			
			if(additionalProperties)
			{
				for(var additionalPropertyIndex=0
						;additionalPropertyIndex<additionalProperties.length 
						;additionalPropertyIndex++) 
				{
					var additionalPropertyName = additionalProperties[additionalPropertyIndex];
					var propertyValue = getPropertyValue(viewedObject, additionalPropertyName);
					
					nameMap[name][additionalPropertyName] += propertyValue;
					aggregate[additionalPropertyName]+=propertyValue;
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
						if(propertyName)
						{
							itemA = nameMap[a][propertyName];
							itemB = nameMap[b][propertyName];
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

/*
 * returns averageData ={ <timeStamp>:{<name>:[averagePropertyData, occurrence ]}}
 * */
function getAverageData(mashedData, singleItem, propertyName )
{
	var averageData ={};
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
			if(propertyName)
			{
				var propertyValue = parseFloat(viewedObject[propertyName]);
				nameMap[name][0] += propertyValue;
			}			
			
			
			nameMap[name][1]++;
		}
		if(singleItem)
		{
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
			
			
			averageData[key]={};
			averageData[key][maxOccurredName]=nameMap[maxOccurredName];
		}
		else
		{
			averageData[key] = nameMap;
		}
		
		
		
	 }
	 
	 return averageData;
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
