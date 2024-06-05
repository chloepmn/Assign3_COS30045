function init() {

    var w = 800;
    var h = 400;
    var padding = 50;

    var dataset = [];

    d3.csv("life_expectancy.csv", function(d) {
        return {
            country: d.COU,
            year: +d.YEA,
            value: +d.Value,
            variable: d.VAR
        };
    }).then(function(data) {
        // Filter data for Total population at birth for years 2011-2019 for Australia and Canada
        dataset = data.filter(d => d.variable === "EVIETOTA" && d.year >= 2011 && d.year <= 2019 && (d.country === "AUS" || d.country === "CAN"));

        lineChart(dataset);
        console.table(dataset, ["country", "year", "value"]);
    });

    function lineChart(dataset) {

        var xScale = d3.scaleTime()
                .domain([new Date(2011, 0, 1), new Date(2019, 11, 31)])
                .range([padding + 20, w - padding]); 

        var yScale = d3.scaleLinear()
                .domain([d3.min(dataset, d => d.value) - 1, d3.max(dataset, d => d.value) + 1])
                .range([h - padding, padding]);

        var line = d3.line()
                 .x(d => xScale(new Date(d.year, 0, 1)))
                 .y(d => yScale(d.value));

        var svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

        var colors = {
            "AUS": "green",
            "CAN": "red"
        };

        var outlines = {
            "AUS": "black",
            "CAN": "none"
        };

        var ausData = dataset.filter(d => d.country === "AUS");
        var canData = dataset.filter(d => d.country === "CAN");

        function drawLine(data, country) {
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", colors[country])
                .attr("fill", "none");

            svg.selectAll(`circle.${country}`)
                .data(data)
                .enter()
                .append("circle")
                .attr("class", country)
                .attr("cx", d => xScale(new Date(d.year, 0, 1)))
                .attr("cy", d => yScale(d.value))
                .attr("r", 5)
                .attr("fill", colors[country])
                .attr("stroke", outlines[country])
                .attr("stroke-width", 2);
        }

        drawLine(ausData, "AUS");
        drawLine(canData, "CAN");

        var xAxis = d3.axisBottom()
                    .ticks(9)
                    .scale(xScale);

        var yAxis = d3.axisLeft()
                    .ticks(10)
                    .scale(yScale);

        svg.append("g")
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + (padding + 20) + ", 0)")
            .call(yAxis);

        var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("transform", `translate(${w - padding - 120}, ${padding})`);

        var countries = ["AUS", "CAN"];
        countries.forEach((country, i) => {
            var legendRow = legend.append("g")
                                  .attr("transform", `translate(0, ${i * 20})`);
            
            legendRow.append("rect")
                     .attr("width", 10)
                     .attr("height", 10)
                     .attr("fill", colors[country])
                     .attr("stroke", outlines[country])
                     .attr("stroke-width", 2);
            
            legendRow.append("text")
                     .attr("x", 20)
                     .attr("y", 10)
                     .attr("text-anchor", "start")
                     .style("text-transform", "capitalize")
                     .text(country === "AUS" ? "Australia" : "Canada");

            legendRow.on("click", function() {
                var isActive = d3.selectAll(`.${country}`).style("display") === "none";
                d3.selectAll(`.${country}`).style("display", isActive ? "block" : "none");
            });
        });
    }
}

window.onload = init;
