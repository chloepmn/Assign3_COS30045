function init() {

    // Set the width and height of the SVG container
    var w = 500;
    var h = 300;

    // Define the projection for the map
    var projection = d3.geoMercator()
                    .center([145, -36.5])
                    .translate([w / 2, h / 2])
                    .scale(2450);

    // Define the path generator
    var path = d3.geoPath()
                .projection(projection);

    // Create an SVG element
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "#043051")

    // Load the JSON data for the map
    d3.json("LGA_VIC.json").then(function(json) {
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path);
    });
}

window.onload = init;
