// Dataset for total male cancer cases per country (cases per 100,000 persons)
var dataset = [
   { country: "Australia", cases: 1622.4 },
   { country: "Austria", cases: 2206.5 },
   { country: "Belgium", cases: 2643.7 },
   { country: "Brazil", cases: 346.0 },
   { country: "Canada", cases: 1511.5 },
   { country: "Chile", cases: 678.6 },
   { country: "Colombia", cases: 51.3 },
   { country: "Costa Rica", cases: 270.9 },
   { country: "Czechia", cases: 2075.4 },
   { country: "Denmark", cases: 1924.2 },
   { country: "Estonia", cases: 896.4 },
   { country: "Finland", cases: 1644.5 },
   { country: "France", cases: 1872.5 },
   { country: "Germany", cases: 2280.7 },
   { country: "Greece", cases: 1371.5 },
   { country: "Hungary", cases: 1784.9 },
   { country: "Iceland", cases: 1183.4 },
   { country: "Ireland", cases: 1644.7 },
   { country: "Israel", cases: 982.5 },
   { country: "Italy", cases: 1804.6 },
   { country: "Japan", cases: 1486.4 },
   { country: "Korea", cases: 1216.2 },
   { country: "Latvia", cases: 518.4 },
   { country: "Lithuania", cases: 377.5 },
   { country: "Luxembourg", cases: 1101.3 },
   { country: "Mexico", cases: 455.8 },
   { country: "Netherlands", cases: 1339.5 },
   { country: "New Zealand", cases: 826.2 },
   { country: "Norway", cases: 1379.8 },
   { country: "Poland", cases: 947.3 },
   { country: "Portugal", cases: 859.8 },
   { country: "Slovak Republic", cases: 950.3 },
   { country: "Slovenia", cases: 836.2 },
   { country: "Spain", cases: 1262.7 },
   { country: "Sweden", cases: 1776.4 },
   { country: "Switzerland", cases: 1273.2 },
   { country: "Türkiye", cases: 409.6 },
   { country: "United Kingdom", cases: 1548.5 },
   { country: "United States", cases: 1621.6 }
];

// Mapping of full country names to abbreviations
var countryAbbreviations = {
   "Australia": "AUS",
   "Austria": "AUT",
   "Belgium": "BEL",
   "Brazil": "BRA",
   "Canada": "CAN",
   "Chile": "CHL",
   "Colombia": "COL",
   "Costa Rica": "CRI",
   "Czechia": "CZE",
   "Denmark": "DNK",
   "Estonia": "EST",
   "Finland": "FIN",
   "France": "FRA",
   "Germany": "DEU",
   "Greece": "GRC",
   "Hungary": "HUN",
   "Iceland": "ISL",
   "Ireland": "IRL",
   "Israel": "ISR",
   "Italy": "ITA",
   "Japan": "JPN",
   "Korea": "KOR",
   "Latvia": "LVA",
   "Lithuania": "LTU",
   "Luxembourg": "LUX",
   "Mexico": "MEX",
   "Netherlands": "NLD",
   "New Zealand": "NZL",
   "Norway": "NOR",
   "Poland": "POL",
   "Portugal": "PRT",
   "Slovak Republic": "SVK",
   "Slovenia": "SVN",
   "Spain": "ESP",
   "Sweden": "SWE",
   "Switzerland": "CHE",
   "Türkiye": "TUR",
   "United Kingdom": "GBR",
   "United States": "USA"
};

// Chart dimensions
var w = 900;
var h = 550;
var padding = 80; // Padding to allow for axis labels and space

// Create the scales for x (countries) and y (cases)
var xScale = d3.scaleBand()
                .domain(dataset.map(d => countryAbbreviations[d.country]))  // Use abbreviations
                .range([padding, w - padding])
                .padding(0.2); // Padding between bars

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.cases)])
                .range([h - padding, padding]);

// Use a blue color scale
var colorScale = d3.scaleSequential(d3.interpolateBlues)
                    .domain([0, d3.max(dataset, d => d.cases)]);

// Create an SVG element
var svg = d3.select("#chart")
             .append("svg")
             .attr("width", w)
             .attr("height", h);

// Tooltip for hover functionality
var tooltip = d3.select("body").append("div")
                 .attr("class", "tooltip")
                 .style("opacity", 0);

// Draw the bars for each country in the dataset
function drawBars(data) {
   // Find the maximum and minimum cases
   var maxCases = d3.max(data, d => d.cases);
   var minCases = d3.min(data, d => d.cases);

   var bars = svg.selectAll("rect").data(data);

   // Enter: create the bars
   bars.enter()
       .append("rect")
       .attr("x", d => xScale(countryAbbreviations[d.country]))  // Use abbreviations
       .attr("y", d => yScale(d.cases))
       .attr("width", xScale.bandwidth())
       .attr("height", d => h - padding - yScale(d.cases))
       .attr("fill", d => {
           // Conditional color fill
           if (d.cases === maxCases) {
               return "red"; // Most cases
           } else if (d.cases === minCases) {
               return "green"; // Least cases
           } else {
               return colorScale(d.cases); // Use blue color scale for others
           }
       })
       .on("mouseover", function(d) {
         d3.select(this).attr("fill", "orange"); // Change color on hover
         tooltip.transition().duration(200).style("opacity", 0.9);
         tooltip.html(d.country + "<br/>" + d.cases)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
       })
       .on("mouseout", function(d) {
         d3.select(this).attr("fill", d => {
             // Reset color after hover
             if (d.cases === maxCases) {
                 return "red"; // Reset to red
             } else if (d.cases === minCases) {
                 return "green"; // Reset to green
             } else {
                 return colorScale(d.cases); // Reset to blue
             }
         });
         tooltip.transition().duration(500).style("opacity", 0);
       });

   // Update: transition existing bars
   bars.transition()
       .duration(800)
       .ease(d3.easeElasticOut)
       .attr("x", d => xScale(countryAbbreviations[d.country]))  // Use abbreviations
       .attr("y", d => yScale(d.cases))
       .attr("height", d => h - padding - yScale(d.cases))
       .attr("fill", d => {
           // Update the color during transition
           if (d.cases === maxCases) {
               return "red";
           } else if (d.cases === minCases) {
               return "green";
           } else {
               return colorScale(d.cases);
           }
       });

   // Exit: remove any extra bars
   bars.exit().remove();
}

// Draw the bars initially
drawBars(dataset);

// Add x-axis with rotated labels
svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

// Add y-axis
svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(d3.axisLeft(yScale));

// Add x-axis label
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", w / 2)
    .attr("y", h - 20)  // Adjust spacing for x-axis label
    .style("text-anchor", "middle")
    .text("Country");

// Add y-axis label
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", -h / 2)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Total Male Cancer Cases (Cases per 100,000 persons)");

// Sort the dataset by cases and redraw the bars
d3.select("#sortByCases").on("click", function() {
   dataset.sort((a, b) => b.cases - a.cases);  // Sort by cases (descending)
   xScale.domain(dataset.map(d => countryAbbreviations[d.country]));  // Update xScale based on new domain
   drawBars(dataset);  // Redraw the bars
   svg.select("g").call(d3.axisBottom(xScale)).selectAll("text")
      .attr("transform", "rotate(-45)").style("text-anchor", "end");
});

// Sort the dataset by country name and redraw the bars
d3.select("#sortByCountry").on("click", function() {
   dataset.sort((a, b) => d3.ascending(a.country, b.country));  // Sort alphabetically by country
   xScale.domain(dataset.map(d => countryAbbreviations[d.country]));  // Update xScale based on new domain
   drawBars(dataset);  // Redraw the bars
   svg.select("g").call(d3.axisBottom(xScale)).selectAll("text")
      .attr("transform", "rotate(-45)").style("text-anchor", "end");
});

// Add a legend for most and least cases
const legendData = [
   { label: "Most Cases", color: "red" },
   { label: "Least Cases", color: "green" }
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
       .style("background-color", item.color);

   legendItem.append("div")
       .attr("class", "legend-item-text")
       .text(item.label);
});
