// Complete dataset based on the CSV files for male, female, and both (Total) cancer cases
const dataBoth = [
  {year: 2008, cases: 314.1, type: "Malignant neoplasms"},
  {year: 2002, cases: 312.0, type: "Malignant neoplasms"},
  {year: 2012, cases: 38.4, type: "Malignant neoplasms of colon, rectum and anus"},
  // More data entries...
];

const dataFemale = [
  {year: 2012, cases: 278.6, type: "Malignant neoplasms"},
  {year: 2002, cases: 16.8, type: "Malignant neoplasms of trachea, bronchus, lung"},
  {year: 2008, cases: 5.5, type: "Malignant neoplasms of cervix uteri"},
  // More data entries...
];

const dataMale = [
  {year: 2008, cases: 32.9, type: "Malignant neoplasms of trachea, bronchus, lung"},
  {year: 2002, cases: 39.5, type: "Malignant neoplasms of trachea, bronchus, lung"},
  {year: 2012, cases: 373.9, type: "Malignant neoplasms"},
  // More data entries...
];

let currentData = dataBoth;

const padding = 40;
const h = 400;
const w = 700;

const xScale = d3.scaleBand().domain(d3.range(currentData.length)).range([0, w - padding]).paddingInner(0.05);
const yScale = d3.scaleLinear().domain([0, d3.max(currentData, d => d.cases)]).range([0, h - padding]);

// Create SVG element
const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Function to update the chart based on new data
function updateChart(data) {
    // Update the scales
    xScale.domain(d3.range(data.length));
    yScale.domain([0, d3.max(data, d => d.cases)]);

    // Bind the data to the rectangles
    const bars = svg
        .selectAll("rect")
        .data(data);

    // Enter new bars
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => h - yScale(d.cases))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d.cases))
        .attr("fill", "steelblue");

    // Remove old bars
    bars.exit().remove();

    // Add labels
    const labels = svg.selectAll("text").data(data);

    labels.enter()
        .append("text")
        .merge(labels)
        .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
        .attr("y", d => h - yScale(d.cases) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.cases);

    labels.exit().remove();
}

// Initial chart draw
updateChart(currentData);

// Update functions for buttons
d3.select("#both").on("click", () => updateChart(dataBoth));
d3.select("#female").on("click", () => updateChart(dataFemale));
d3.select("#male").on("click", () => updateChart(dataMale));

// Sorting function
d3.select("#sort").on("click", () => {
    currentData.sort((a, b) => b.cases - a.cases);
    updateChart(currentData);
});
