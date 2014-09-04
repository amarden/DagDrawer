myApp.directive("dag", function() {
    return {
        restrict: 'E',
        link: function(scope, elem) {
            var width = document.getElementById('dag').offsetWidth;
            var height = document.getElementById('dag').offsetHeight;
            var rectWidth = 50;
            var rectHeight = 25;
            var links = [], link;

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

            scope.$watchCollection('toDraw', function() {
                updateDag();
            });

            var updateDag = function() {
                var node = svg.selectAll("g.node")
                    .data(scope.toDraw, function(d) { return d.name;});

                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .on("dblclick", function(d,i) {
                        if (d3.event.defaultPrevented && scope.toDraw.length >1) return;
                        var n  = i===0 ? 1 : 0;
                        var link = {source:d, target:scope.toDraw[n]};
                        d.links.push(link);
                        links.push(link);
                        drawLinks();
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
                    ;

                    link.exit().remove();
                };

                force.on("tick", function() {
                    if(link) {
                        link.attr("d", function(d) {
                            var offSetWS, offSetWT;
                            var widthDiff = d.source.x - d.target.x;
                            if(Math.abs(widthDiff) > rectWidth) {
                                console.log("here");
                                offSetWS = widthDiff < 0 ? rectWidth : 0;
                                offSetWT = widthDiff > 0 ? rectWidth : 0;
                            }
                            else {
                                offSetWS = widthDiff > 0 ? widthDiff : -widthDiff;
                                offSetWT = widthDiff > 0 ? -widthDiff/2 : widthDiff/2;
                                offSetWT += rectWidth;
                            }
                            var offSetHS = d.source.y < d.target.y ? rectHeight : 0;
                            var offSetHT = d.source.y > d.target.y ? rectHeight: 0;
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
