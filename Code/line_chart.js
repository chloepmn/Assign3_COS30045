function init() {

    // Set the dimensions and padding for the chart
    var w = 600;
    var h = 300;
    var padding = 50;

    // Initialize an empty dataset array
    var dataset = [];

    // Load the data from the CSV file using D3.js
    d3.csv("Unemployment_78-95.csv", function(d) {
        return {
            date: new Date(+d.year, +d.month - 1),
            number: +d.number
        };
    }).then(function(data) {
        dataset = data;

        lineChart(dataset);
        console.table(dataset, ["date", "number"]);
    });    

    // Call the lineChart function to create the chart using the loaded dataset
    function lineChart(dataset) {

        // Define xScale mapping dates to x-coordinates within the chart area
        xScale = d3.scaleTime()
                .domain([
                    d3.min(dataset, function(d) { return d.date; }),
                    d3.max(dataset, function(d) { return d.date; })
                ])
                .range([padding + 20, w - padding]); 

        // Define yScale mapping numbers to y-coordinates within the chart area
        yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { return d.number; })])
                .range([h - padding, padding]);

        // Define the line generator
        line = d3.line()
                 .x(function(d) { return xScale(d.date); })
                 .y(function(d) { return yScale(d.number); });

        // Define the area generator
        area = d3.area()
                 .x(function (d) { return xScale(d.date); })
                 //base line for area shape
                 .y0(function() { return yScale.range()[0]; })
                 .y1(function(d) { return yScale(d.number); });

        // Create an SVG element for the chart
        var svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

                // Append the area path to the SVG element
                svg.append("path")
                    .datum(dataset)
                    .attr("class", "line")
                    .attr("d", area);
        
        // Define and append x-axis to the SVG element
        var xAxis = d3.axisBottom()
                    .ticks(10)
                    .scale(xScale);

        // Define and append y-axis to the SVG element
        var yAxis = d3.axisLeft()
                    .ticks(10)
                    .scale(yScale);

                svg.append("g")
                    .attr("transform", "translate(0, " + (h - padding) + ")")
                    .call(xAxis);
            
                svg.append("g")
                    .attr("transform", "translate(" + (padding + 20) + ", 0)")
                    .call(yAxis);
                
                // Append a horizontal line indicating half a million unemployed
                svg.append("line")
                    .attr("class", "line halfMilMark")
                    //start of line
                    .attr("x1", padding + 20)
                    .attr("y1", yScale(500000))
                    //end of line
                    .attr("x2", w - padding)
                    .attr("y2", yScale(500000));
                
                // Append a text label for half a million unemployed
                svg.append("text")
                    .attr("class", "halfMilLabel")
                    .attr("x", padding + 30)
                    .attr("y", yScale(500000) - 7)
                    .text("Half a million unemployed");
    }
}

window.onload = init;
