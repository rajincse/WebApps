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
 * returns averageData ={ <timeStamp>:{<name>:[averagePropertyData, occurrence ]}}
 * */
function getAverageData(mashedData, propertyName, singleItem)
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
			
			var propertyValue = parseFloat(viewedObject[propertyName]);
			nameMap[name][0] += propertyValue;
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
