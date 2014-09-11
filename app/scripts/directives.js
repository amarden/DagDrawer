myApp.directive("dag", function() {
    return {
        restrict: 'E',
        link: function(scope, elem) {
            var width = document.getElementById('dag').offsetWidth;
            var height = document.getElementById('dag').offsetHeight;
            var rectWidth = 50;
            var rectHeight = 25;
            var links = [], linkObj={}, link;

            var line = d3.svg.line()
                    .x(function(d) {return d.x; })
                    .y(function(d) {return d.y; })
            ;

            var svg = d3.select(elem[0])
                .append("svg")
                .attr("class", "dag-svg")
                .attr("width", width)
                .attr("height", height)
            ;

            var force = d3.layout.force()
                .size([width, height])
                .charge(-300)
                .nodes(scope.toDraw)
                //.links(links)
                ;

            function dragstart(d) {
                d.fixed = true;
            }

            var drag = force.drag()
                .on("dragstart", dragstart);

            //create arrow
            svg.append("svg:defs").selectAll("marker")
                .data(["end"])      // Different link/path types can be defined here
                .enter().append("svg:marker")    // This section adds in the arrows
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 8)
                .attr("refY", -0.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            scope.$watchCollection('toDraw', function() {
                updateDag();
            });

            var updateDag = function() {
                var node = svg.selectAll("g.node")
                    .data(scope.toDraw, function(d) { return d.name;});

                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .on("dblclick", function(d) {
                        if (d3.event.defaultPrevented) return; // prevents dragging
                        if (!linkObj.source) { // if no target click refers to target node
                            d3.select(this).select("rect").attr("class","chosen");
                            linkObj.source = d;
                        } else {
                            linkObj.target = d;
                            links.push(linkObj);
                            drawLinks();
                            linkObj = {}; // reset link object
                            d3.selectAll("g").select("rect").attr("class","")
                        }

                    })
                    .call(drag);

                nodeEnter.append("rect")
                    .attr("class", "params")
//                    .attr("rx", 15)
//                    .attr("ry", 15)
                    .attr("width", rectWidth)
                    .attr("height", rectHeight);

                nodeEnter.append("text")
                    .attr("dx", rectWidth/2)
                    .attr("dy", rectHeight/2)
                    .text(function(d) { return d.name });

                node.exit().remove();

                var drawLinks = function() {
                    link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            return d.source.name+"-"+ d.target.name;
                        });

                    link.enter().insert("path", "g.node")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            return line([{"x":d.source.x , "y":d.source.y },
                                {"x":d.target.x , "y":d.target.y}]) })
                        .attr("marker-end", "url(#end)");
                    ;

                    link.exit().remove();
                };

                force.on("tick", function() {
                    if(link) {
                        link.attr("d", function(d) {
                            var offSetWS, offSetWT, offSetHT, offSetHS;
                            var widthDiff = d.source.x - d.target.x;
                            var heightDiff = d.source.y - d.target.y;
                            if(Math.abs(widthDiff) > rectWidth) {
                                offSetWS = widthDiff < 0 ? rectWidth : 0;
                                offSetWT = widthDiff > 0 ? rectWidth : 0;
                            } else {
                                offSetWS = offSetWT = rectWidth/2;
                            }
                            if(Math.abs(heightDiff) > rectHeight) {
                                offSetHS = heightDiff < 0 ? rectHeight : 0;
                                offSetHT = heightDiff > 0 ? rectHeight : 0;
                            } else {
                                offSetHT = offSetHS = rectHeight/2;
                            }
                            return line([{"x":d.source.x+offSetWS, "y":d.source.y+offSetHS },
                                {"x":d.target.x+offSetWT , "y":d.target.y+offSetHT}])
                        });
                    }

                    node.attr("transform", function(d){
                        return "translate(" + d.x+","+d.y  + ")"
                    });
                });
                force.start();
            };
        }
    };
});
