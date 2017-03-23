var mainData={};
var imageData={};
var colorData={};
var maxTime =0.0;

var propertyMax = {
		'hazard':1,
		'viewTime':100
};
var propertyMin ={ 
		'hazard': 0,
		'viewTime':0
}
var hazardData ={};
var hazardTypeData ={};

function loadData(dataFile)
{
	d3.tsv(dataFile, function(data) {
		  
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
				checkForMinMax(value);
			}
			
		});
	
	d3.tsv("data/itemImages.txt", function(data)
	{
		for(var i=0;i<data.length;i++)
		{
			var item = data[i].item.trim();
			
			var image = data[i].image;
			
			imageData[item]=image;
			colorData[item] = colores_google(i);
		}

	});
	
	d3.tsv("data/hazardData.txt", function(data)
	{
		for(var i=0;i<data.length;i++)
		{
			var doi = data[i].DOI.trim();
			var startTime = parseFloat(data[i].TimeStart);
			var endTime = parseFloat(data[i].TimeEnd);
			var hazardType = data[i].HazardType;
			
			var hazardInfoObject ={
					"startTime":startTime,
					"endTime":endTime,
					"hazardType": hazardType
			};
			
			if(!hazardData[doi])
			{
				hazardData[doi] =[];
			}
			hazardData[doi].push(hazardInfoObject);
			
		}

	});
	
	d3.tsv("data/hazardType.txt", function(data)
	{
		for(var i=0;i<data.length;i++)
		{
			var hazardType = data[i].HazardType;
			var hazardName = data[i].HazardName;
			var color = data[i].Color;
			
			var hazardTypeInfoObject ={
					"hazardType":hazardType,
					"hazardName":hazardName,
					"color": color
			};
			
			
			hazardTypeData[hazardType] = hazardTypeInfoObject;
			
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
function checkForMinMax(jsonText)
{
	var dataArray = JSON.parse(jsonText);
	for(var i=0;i<dataArray.length;i++)
	{
		var data = dataArray[i];
		var properties = Object.keys(data);
		for(var j=0;j< properties.length;j++)
		{
			var property = properties[j]
			var value = getPropertyValue(data, property);
			if(!propertyMax[property] || value > propertyMax[property])
			{
				propertyMax[property] = value;
			}
			
			if(!propertyMin[property] || data[property] < propertyMin[property])
			{
				propertyMin[property] = value;
			}
			
			
		}
	}
	
}
