// Dataset for total cancer cases by gender per year
var dataByYear = {
    "1998": { male: 500, female: 600 },
    "2000": { male: 520, female: 630 },
    "2002": { male: 540, female: 650 },
    "2008": { male: 580, female: 700 },
    "2012": { male: 600, female: 720 }
};

// Chart dimensions
var width = 500;
var height = 500;
var radius = Math.min(width, height) / 2;

// Create an SVG element
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Define color scale (ensure it matches the pie chart)
var color = d3.scaleOrdinal(["#1f77b4", "#ff7f0e"]);

// Function to draw the pie chart
function drawPieChart(year) {
    // Remove any existing pie chart
    svg.selectAll("*").remove();

    // Get data for the selected year
    var data = dataByYear[year];
    var pieData = [
        { label: "Male", value: data.male },
        { label: "Female", value: data.female }
    ];

    // Generate the pie and arc
    var pie = d3.pie().value(d => d.value);
    var arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Bind data and create pie chart with a float-in animation
    var arcs = svg.selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Append path for each arc with animation
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .each(function (d) { this._current = d; }) // Store the current angles
        .transition() // Add the animation
        .ease(d3.easeBackOut) // Smooth float-in effect
        .duration(1000)
        .attrTween("d", function(d) {
            var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function(t) {
                return arc(i(t));
            };
        });

    // Append text labels for gender
    arcs.append("text")
        .attr("transform", d => "translate(" + arc.centroid(d) + ")")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .text(d => d.data.label);

    // Append text for values (cancer cases) below the labels
    arcs.append("text")
        .attr("transform", d => {
            var centroid = arc.centroid(d);
            return "translate(" + centroid[0] + "," + (centroid[1] + 20) + ")"; // Slightly below the label
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(d => d.data.value + " cases");
}

// Initial draw
drawPieChart("1998");

// Update chart when year is changed
d3.select("#yearSelect").on("change", function() {
    var selectedYear = d3.select(this).property("value");
    drawPieChart(selectedYear);
});

// Legend data (now uses the color scale dynamically)
const legendData = [
    { label: "Total Cancer Cases of Males in 42 Countries", key: "Male" },
    { label: "Total Cancer Cases of Females in 42 Countries", key: "Female" }
];

const legend = d3.select("body")
    .append("div")
    .attr("class", "legend");

legend.append("div")
    .attr("class", "legend-title")
    .text("Legend");

legendData.forEach((item, i) => {
    const legendItem = legend.append("div")
        .attr("class", "legend-item");

    legendItem.append("div")
        .attr("class", "legend-item-color")
        .style("background-color", color(item.key));  // Use the color scale

    legendItem.append("div")
        .attr("class", "legend-item-text")
        .text(item.label);
});
