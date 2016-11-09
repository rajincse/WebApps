var mainData={};
var maxTime =0;
function loadData()
{
	d3.tsv("data/smallVisible.txt", function(data) {
		  
			for(var i=0;i<data.length;i++)
			{
				var key = data[i].key;
//				var timeKeyValue = key.split('||');
//				var timeSplit = timeKeyValue[0].split('=');
//				console.log('Time:'+timeSplit[1]);
				
				
				var value = data[i].value;
				
				mainData[key]=value;
				
			}
			
		});
}

function render()
{
	var svg =d3.select('svg');
	svg.attr('width', 640);
	svg.attr('height', 480);
	
	
}