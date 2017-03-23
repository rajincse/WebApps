
var gap =20;
var focusHeight =500;
var contextHeight = 120;

var svgWidth =960;
var svgHeight = focusHeight+contextHeight + 3 * gap;

var imageWidth =32;
var imageHeight = 32;
var padding = 16;
var imageAreaWidth = imageWidth+padding;
var imageAreaHeight =imageHeight+padding;

var levitation = 0.25;

var eyeResponseTime =0.1;

var attentionSpan = 2;
var frequency = 50;

var minimumCameraDistance = 5;
var viewedWindowSize =6;

var aggregateProperties ={
		'size': { 'color': '#a0e85b', 'sortingValue':'average', 'starplot':true , 'type':'float'}, 
		'viewTime':{ 'color':'#9f49f0' , 'sortingValue':'sum', 'starplot':true, 'type':'float'}, 
		'viewed':{ 'color':'#54a32f', 'sortingValue':'average', 'starplot':true, 'type':'float'}, 
		'rotationSpeed':{ 'color':'#fb0998', 'sortingValue':'average', 'starplot':true, 'type':'float'}, 
		'translationSpeed':{ 'color':'#00d618', 'sortingValue':'average', 'starplot':true, 'type':'float'},
		'cameraDistance': { 'color':'#961d6b', 'sortingValue':'average', 'starplot':true, 'type':'float'},
		'hazardViewTime': { 'color':'#75eab6', 'sortingValue':'average', 'starplot':true, 'type':'float'},
		'hazardTypeSet': { 'color':'#75eab6', 'sortingValue':'size', 'starplot':false, 'type':'list'}
		
};