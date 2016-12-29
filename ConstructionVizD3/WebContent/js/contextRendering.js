function contextRendering(sortingProperty, sortAscending)
{
	
	var svg =d3.select('#mainSVG');
	
	svg.attr('width',svgWidth);
	svg.attr('height',svgHeight);
	

	
	var marginFocus = {top: 20, right: 20, bottom: 160, left: 40},
    marginContext = {top: 430, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - marginFocus.left - marginFocus.right,
    heightFocus = +svg.attr("height") - marginFocus.top - marginFocus.bottom,
    heightContext = +svg.attr("height") - marginContext.top - marginContext.bottom;
	
	var xScaleFocus = d3.scaleLinear().range([0,width]);
	var xAxisFocus = d3.axisBottom(xScaleFocus);	
	var yScaleFocus = d3.scaleLinear().range([0,heightFocus]);
	var yAxisFocus = d3.axisLeft(yScaleFocus); 
	
	
	var xScaleContext = d3.scaleLinear().range([0,width]);	
	var xAxisContext = d3.axisBottom(xScaleContext);	
	var yScaleContext = d3.scaleLinear().range([0,heightContext]);
	
	
    
	var brushContext = d3.brushX()
    .extent([[0, 0], [width, heightContext]])
    .on("brush end", brushed);

	var zoomFocus = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, heightFocus]])
    .extent([[0, 0], [width, heightFocus]])
    .on("zoom", zoomed);
	
	svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", heightFocus)
    .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")")
    .call(zoomFocus);
	
	var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")");

	var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + marginContext.left + "," + marginContext.top + ")");
	
	var keyData = Object.keys(mainData);
	
	xScaleFocus
		.domain(
			d3.extent(keyData, 
					function(key){
						return getTimestamp(key);
					})
		);
	var maxY = 100;
	yScaleFocus.domain([maxY,0]);
	
	xScaleContext.domain(xScaleFocus.domain());
	yScaleContext.domain(yScaleFocus.domain());
	
	focus.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + heightFocus + ")")
    .call(xAxisFocus);

//	focus.append("g")
//    .attr("class", "axis axis--y")
//    .call(yAxisFocus);
	
	
	 
	 
	 
//	 svg.append('text')
//      .attr("class", "label")      
//      .attr("x", -heightFocus/2)
//      .attr("y", 12)
//      .attr("transform", "rotate(-90)")
//      .style("text-anchor", "end")
//      .text("Camera Distance");
//	 
	 svg.append('text')
     .attr("class", "label")      
     .attr("x", width+10 )
     .attr("y", heightFocus+10)
     .style("text-anchor", "end")
     .text("Time");
	 

	 
	 
	 // Context Region 
	 renderContext(context, xScaleContext, heightContext, maxY,sortingProperty, sortAscending);
	 context.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + heightContext + ")")
	    .call(xAxisContext);
		 context.append("g")
	      .attr("class", "brush")
	      .call(brushContext)
	      .call(brushContext.move, xScaleFocus.range());
	
	 // Focus Region
	 renderFocus(focus, xScaleFocus, heightFocus, maxY, sortingProperty, sortAscending);
	
	
	function brushed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore
																					// brush-by-zoom
		  var s = d3.event.selection || xScaleContext.range();
		  xScaleFocus.domain(s.map(xScaleContext.invert, xScaleContext));

		  focus.select(".axis--x").call(xAxisFocus);
		  svg.select(".zoom").call(zoomFocus.transform, d3.zoomIdentity
		      .scale(width / (s[1] - s[0]))
		      .translate(-s[0], 0));
		}

	function zoomed() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore
																					// zoom-by-brush
	  var t = d3.event.transform;
	  xScaleFocus.domain(t.rescaleX(xScaleContext).domain());
	  renderFocus(focus, xScaleFocus, heightFocus, maxY, sortingProperty, sortAscending);
	  focus.select(".axis--x").call(xAxisFocus);
	  context.select(".brush").call(brushContext.move, xScaleFocus.range().map(t.invertX, t));
	}
	
	
	d3.select('#zoomIn')
	.on('click', onZoomIn);
	d3.select('#zoomOut')
	.on('click', onZoomOut);
	function onZoomIn()
	{
		var rect = d3.select('rect.zoom');
		zoomFocus.scaleBy(rect, 1.1);
	}

	function onZoomOut()
	{
		var rect = d3.select('rect.zoom');
		zoomFocus.scaleBy(rect, 0.9);
	}
	
	
}
