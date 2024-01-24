import * as d3 from 'd3';

export function createLineChart(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Invalid data");
    return;
  }

  // Set up SVG dimensions and margins
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Remove any existing SVG elements
  d3.select("#filteredData").selectAll("svg").remove();

  // Append the SVG element to the filteredData div
  const svg = d3
    .select("#filteredData")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  try {
    if (data && data.length > 0) {
      // Set up scales
      const x = d3.scaleLinear().domain([1, 12]).range([0, width]);
      const y = d3.scaleLinear().domain([0, 30]).range([height, 0]);

      // Set up the line function
      const line = d3
        .line()
        .x(d => x(d.month))
        .y(d => y(d.count));

      // Add the line path
      svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "blue")  // Adjust based on your color logic
        .attr("d", line);

      // Add circles for each data point
      svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.month))
        .attr("cy", d => y(d.count))
        .attr("r", 5); // Adjust the radius as needed

      // Add the X Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.format("d"))); // Format ticks as integers

      // Add the Y Axis
      svg
        .append("g")
        .call(d3.axisLeft(y).ticks(15));
    } else {
      // Handle the case where data is undefined or empty
      console.error("DataSets are undefined or empty");
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("No data available");
    }
  } catch (error) {
    console.error("Error in createLineChart:", error);
  }
}


export function createBarChart(familyCounts) {
  // Selecteer de div waarin de staafdiagram wordt geplaatst
  const barChartContainer = d3.select('#barChart');

  // Verwijder eventuele eerdere inhoud
  barChartContainer.html('');

  // Bepaal de breedte en hoogte van de staafdiagram
  const width = 400;
  const chartHeight = 300; // Vaste hoogte voor de hele grafiek

  // Marges toevoegen indien nodig
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const height = chartHeight - margin.top - margin.bottom;

  // Sorteer de dataset op basis van het aantal voorkomen (van hoog naar laag)
  familyCounts.sort((a, b) => b.count - a.count);

  // Bepaal de schaal voor de x-as (aantal voorkomen)
  const xScale = d3.scaleLinear()
    .domain([0, 15])  // Zet het domein op 0 tot 15
    .range([0, width]);

  // Vaste hoogte voor de bars
  const barHeight = 18;
  const barSpacing = 2; // Vaste afstand tussen de bars

  // Bereken de totale hoogte die de bars zullen innemen
  const totalBarHeight = (barHeight + barSpacing) * familyCounts.length;

  // Bepaal de schaal voor de y-as (families)
  const yScale = d3.scaleBand()
    .domain(familyCounts.map(d => d.family))
    .range([0, totalBarHeight]) // Gebruik de totale hoogte
    .paddingInner(barSpacing / totalBarHeight) // Vaste ruimte tussen de bars
    .paddingOuter(barSpacing / totalBarHeight);

  // Voeg een SVG-element toe aan de div
  const svg = barChartContainer.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', chartHeight) // Vaste hoogte voor de hele grafiek
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Voeg de staafjes toe aan de staafdiagram
  svg.selectAll('rect')
    .data(familyCounts)
    .enter().append('rect')
    .attr('x', 0)
    .attr('y', d => yScale(d.family))
    .attr('width', d => xScale(d.count))
    .attr('height', barHeight) // Vaste hoogte voor de bars
    .attr('fill', 'steelblue');

  // Voeg x-as toe
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(15)); // Pas het aantal ticks aan indien nodig

  // Voeg y-as toe
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .style('text-anchor', 'end');

  // Voeg een titel toe
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.top)
    .style('text-anchor', 'middle');
}

