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
    selectedIndex =-1;
}
function onClick(d, i)
{
    d3.event.stopPropagation();
    selectedIndex = i;
    
    d3.select('.selected-content')
            .style('visibility','visible')
            .style('left',d3.event.pageX+'px')
            .style('top', d3.event.pageY+'px')
        ;


    var svgWidth = d3.select('.media-image-svg').attr('width');


    var selectedObject =inputdb.getContent(d.dataObject.label);

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