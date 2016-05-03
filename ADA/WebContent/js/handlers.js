/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var drag = d3.behavior.drag()
                .on("dragstart", dragstarted)
                .on("drag", dragged)
                .on("dragend", dragended);
var dragX =labelRectWidth;
function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }

  function dragged(d) {
      dragX+= d3.event.dx;
    d3.select(this).attr("transform", "translate(" +  dragX+",0)");
  }

  function dragended(d) {
    d3.select(this).classed("dragging", false);
  }

var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
function zoom() {
    d3.select('#base').attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
var zoomListernerWithVerticalPanning = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", verticalPanningZoom);
function verticalPanningZoom() {
    d3.select('#base').attr("transform", "translate(0," + d3.event.translate[1] + ")scale(" + d3.event.scale + ")");
}
function initZoom()
{
    zoomListener.scale(1);
    zoomListener.translate([0,0]);
    zoomListernerWithVerticalPanning.scale(1);
    zoomListernerWithVerticalPanning.translate([0,0]);
}

function onZoomIn()
{
    var newScale = Math.min(3, getScale()+0.1);
    setScale(newScale);
}

function onZoomOut()
{
    var newScale = Math.max(0.1, getScale()-0.1);
    setScale(newScale);
}
function getScale()
{
     var transform =d3.select('#base').attr("transform");
     var regExp = /scale\([-]?\d*\.?\d+\)/;
     if(regExp.test(transform))
     {
         var scaleComamnd = transform.match(regExp)[0];
         var scaleValue = parseFloat(scaleComamnd.match(/[-]?\d*\.?\d+/)[0]);
         return scaleValue;
     }
     return 1.0;
}
function setScale(newScale)
{
    var transform =d3.select('#base').attr("transform");
    var regExp = /scale\([-]?\d*\.?\d+\)/;
    var transformText ='';
    if(regExp.test(transform))
    {
        transformText = transform.replace(regExp, 'scale('+newScale+')');    
    }
    else
    {
        transformText ='scale('+newScale+')';
    }
    d3.select('#base').attr("transform", transformText);
}
var selectedIndex =-1;
function onMouseOver()
{
    var currentElementId = d3.select(this).attr('id');
    var index = currentElementId.split('-');
    var hoverId = 'hover-'+index[1];
    d3.select('#'+hoverId).style('visibility','visible');
}
function onMouseOut()
{
    var currentElementId = d3.select(this).attr('id');
    var index = currentElementId.split('-');
    if(index[1] != selectedIndex)
    {
        var hoverId = 'hover-'+index[1];
        d3.select('#'+hoverId).style('visibility','hidden');
    }
    
}
function onSvgClick(d,i)
{
    d3.select('.selected-content')
            .style('visibility','hidden');
    d3.select('#hover-'+selectedIndex).style('visibility','hidden');
    d3.select('.additional-properties-container').style('visibility','hidden');
    selectedIndex =-1;
}
function refreshAdditionalPropertiesView(ids)
{
    var IdsContainer = d3.select('.additional-properties-container div.ids-container');
    var idsContainerSelection =IdsContainer.selectAll('span').data(ids);
    idsContainerSelection
            .enter().append('span').text(function(d){ return d+',';});
    idsContainerSelection.exit().remove();
    d3.json(dataServletGetElementProperties+ids, 
                function(error, data)
                {
                    var container = d3.select('.additional-properties-container div.all-properties');
                    var divsSelection = container.selectAll('div').data(data.DataArray);
                    divsSelection.exit().remove();
                    var divs = divsSelection
                            .enter()
                            .append('div')
                            .attr('class','row')
                    ;
                    
                    divs.append('div')
                            .attr('class','cell label')                            
                            .text(function(d){ return d.property_name+': ';})                            
                    ;
                    divs.append('div')
                            .attr('class','cell')
                            .text(function(d){ 
                                return d.property_value;
                    })                            
                    ;     
                }
            );
    d3.json(dataServletGetAllProperties, 
                function(error, data)
                {
                    var selectEnter = d3.select('.propertyList')
                                    .selectAll('option').data(data.DataArray)
                                    .enter();
                    selectEnter.append('option')
                            .attr('value', function(d){ return d.id;})
                            .text(function(d){ return d.property_name; })
                        ;
                            
                }
            );
}
function onAdditionalClick(ids, x, y)
{
   
    var dialogBox = d3.select('.additional-properties-container');
    var visibility = dialogBox.style('visibility');
    var newVisibility  = (visibility === 'hidden'? 'visible':'hidden');
    dialogBox.style('visibility',newVisibility)
            .style('left',x+'px')
            .style('top', y+'px')            
        ;
    refreshAdditionalPropertiesView(ids);   
        
        
        d3.select('#addProperty')
                .on('click', function()
                    {
                        var propertyName = d3.select('#propertyName').node().value;
                        var url = 'DataServlet?method=addNewProperty&propertyName='+propertyName;
                        d3.json(url, function(error, data)
                        {
                           refreshAdditionalPropertiesView(ids); 
                        });
                    });
        d3.select('#addPropertyValue')
                .on('click', function()
                    {
                        var propertyId = d3.select('.propertyList').node().value;
                        var propertyValue = d3.select('#propertyValue').node().value;
                        
                        var url = 'DataServlet?method=addNewPropertyValue'
                                        +'&propertyId='+propertyId
                                        +'&elementIds='+ids
                                        +'&propertyValue='+propertyValue;
                        d3.json(url, function(error, data)
                        {
                           refreshAdditionalPropertiesView(ids);
                        });
                    });
        
}
function onClick(d, i)
{
    d3.event.stopPropagation();
    selectedIndex = i;
    
    var x = d3.event.pageX;
    var y = d3.event.pageY;
    d3.select('.selected-content')
            .style('visibility','visible')
            .style('left',d3.event.pageX+'px')
            .style('top', d3.event.pageY+'px')
        ;
    

    var svgWidth = d3.select('.media-image-svg').attr('width');


    var selectedObject =inputdb.getContent(d.dataObject.label);

    d3.select('.id-container').text(d.dataObject.label);
    d3.select('.type').text(selectedObject.type);
    d3.select('.type-text').text(selectedObject.typeText);
    d3.select('.navigation-text').text(selectedObject.navigationText);
    
    if(selectedObject.type ==='image'
            ||selectedObject.type ==='button')
    {
        d3.select('.data-content').text('Image:')
        d3.select('.data-text').text('');

        var imagePath = 'input'+selectedObject.image.path;
        d3.select('.media-image-svg').selectAll("*").remove();
        var ratio = 1.0 * svgWidth /selectedObject.image.dimension[0];

        d3.select('.media-image-svg')
                .attr('height', imageSVGHeight)
                .append('svg:image')
                .attr('xlink:href', imagePath)
                .attr('x',0)
                .attr('y',0)                            
                .attr('width',selectedObject.image.dimension[0] * ratio)
                .attr('height', selectedObject.image.dimension[1] * ratio)
        ;

    }
    else if(selectedObject.type ==='aoi')
    {

        d3.select('.data-content').text('Image:')
        d3.select('.data-text').text('');
        var ratio = 1.0 * svgWidth /selectedObject.image.dimension[0];


        d3.select('.media-image-svg').selectAll("*").remove();
        var imagePath = 'input'+selectedObject.image.path;
        d3.select('.media-image-svg')
                .attr('height', imageSVGHeight)
                .append('svg:image')
                .attr('xlink:href', imagePath)
                .attr('x',0)
                .attr('y',0)
                .attr('width',selectedObject.image.dimension[0] * ratio)
                .attr('height', selectedObject.image.dimension[1] * ratio)
        ;
        if(selectedObject.aoi)
        {
            d3.select('.media-image-svg')
                    .append('rect')
                    .attr('class','aoi-rect')
                    .attr('x',selectedObject.aoi.x* ratio)
                    .attr('y',selectedObject.aoi.y* ratio)
                    .attr('width',selectedObject.aoi.width* ratio)
                    .attr('height', selectedObject.aoi.height* ratio);
            //Title of aoi
//            d3.select('.media-image-svg')
//                    .append('text')
//                    .text(selectedObject.aoi.name)
//                    .attr('x',selectedObject.aoi.x* ratio)
//                    .attr('y',(selectedObject.aoi.y +20)* ratio)
//                    .attr('font-family',"Verdana")
//                    .attr('font-size',20 *ratio)
//                    .attr('fill','blue')
//            ;
        } 
    }
    else if(selectedObject.type ==='text')
    {
        d3.select('.media-image-svg').attr('height', 0).selectAll("*").remove();
        var text = selectedObject.object;
        if(selectedObject.object.text)
        {
            text = selectedObject.object.text;
        }
        d3.select('.data-content').text('Text:');
        d3.select('.data-text').text(text);
    }
}

function onSelectionClick(d, elem){
        var isSelectionCheckBoxChecked = d3.select('#checkBoxSelection').property('checked');
        if(isSelectionCheckBoxChecked)
        {
            
            var element = d3.select(elem);
            var isSelected = (element.attr('selected') === 'true');
            if(isSelected)
            {
                element.attr('selected', 'false');
                element.style('fill', Color.getColorFromType(d).getColorString());
                element.style('fill-opacity',1);
            }
            else
            {
                element.attr('selected', 'true');
                element.style('fill', selectionColor);
                element.style('fill-opacity',0.5);
            }
        }
}