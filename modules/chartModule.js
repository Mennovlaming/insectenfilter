import * as d3 from 'd3';

export function createLineChart(data) {
  // kijk of er data is
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Invalid data");
    return;
  }

  // standaard waardes voor hoogte breedte en margin
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 700 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // je wilt de huidige svg verwijderen en vullen met eigen data/up te daten met gefilterde data
  d3.select("#filteredData").selectAll("svg").remove();

  // ga naar de id filteredData, voeg daar de svg aan toe
  const svg = d3
    .select("#filteredData")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  try {
    if (data && data.length > 0) {
      // ALs de data meer dan 0 is, wil je de volgende code uitvoeren, zo nee ga je naar else
      const x = d3.scaleLinear().domain([1, 12]).range([0, width]);
      const y = d3.scaleLinear().domain([0, 30]).range([height, 0]);

      // lijnfunctie
      const line = d3
        .line()
        .x(d => x(d.month))
        .y(d => y(d.count));

      // path van de lijn
      const linePath = svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#6082B6")
        .style("stroke-width", 3) //Lijndikte
        .attr("d", line);

      // nodig om te animeren
      const totalLength = linePath.node().getTotalLength();
      // je haalt hier eerste de line weg, om hem even later weer terug te halen met een ease en duration van 1sec.
      linePath.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() 
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

        // je animeert ook de circels zodat deze met de lijn mee gaan.
        const circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.month))
        .attr("cy", d => y(d.count))
        .attr("r", 0) // begin met een range van 0 om ze te laten verschijnen
        .attr("fill", "black"); 
      
      // voeg animatie toe aan de cirkels
      circles.transition()
        .delay((d, i) => i * 100) // vertraag elke cirkel op basis van de index
        .duration(200) // duur van de animatie 0.2s
        .attr("r", 5); //we willen ze van 0 range naar 5 krijgen.

      // x-as toevoegen
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        // 12 ticks
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.format("d")));

      // y-as toevoegen
      svg
        .append("g")
        .call(d3.axisLeft(y).ticks(15));
    } else {
      // als er geen data set is wil je dit loggen en een message geven.
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
  // roep de div aan
  const barChartContainer = d3.select('#barChart');

  // leeg deze net als de linechart
  barChartContainer.html('');

  // Basis waardes
  const width = 300;
  const chartHeight = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const height = chartHeight - margin.top - margin.bottom;

  // Sorteer van hoog naar laag
  familyCounts.sort((a, b) => b.count - a.count);

  // bepaal de scale voor de x-as
  const xScale = d3.scaleLinear()
    .domain([0, 15])  // nummers op de x-as
    .range([0, width]);

  // vaste hoogte voor de bars
  const barHeight = 27;
  const barSpacing = 2; //Vaste spacing tussen de bars

  // bereken de totale hoogte die de bars zullen innemen
  const totalBarHeight = (barHeight + barSpacing) * familyCounts.length;

  // bepaal de scale voor de y-as
  const yScale = d3.scaleBand()
    .domain(familyCounts.map(d => d.family))
    .range([0, totalBarHeight]) //Gebruik de totale hoogte
    .paddingInner(barSpacing / totalBarHeight) // Vaste ruimte tussen de bars
    .paddingOuter(barSpacing / totalBarHeight);

  // Voeg een SVG toe aan de div
  const svg = barChartContainer.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', chartHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Voeg de bars toe aan de diagram
  svg.selectAll('rect')
    .data(familyCounts)
    .enter().append('rect')
    .attr('x', 0)
    .attr('y', d => yScale(d.family))
    .attr('width', 0)
    .attr('height', barHeight)
    .attr('fill', '#6082B6')
    .transition()// kleine animatie van 1s
    .duration(1000)
    .attr('width', d => xScale(d.count));

    svg.selectAll('text')
    .data(familyCounts)
    .enter().append('text')
    .text(d => d.family) // tekst is de naam van de soort
    .attr('x', 5)// 5px van de x-as
    .attr('y', d => yScale(d.family) + barHeight / 2) // Plaats de tekst in het midden van de bar
    .style('fill', 'black') 
    .style('font-size', '12px')
    .style('alignment-baseline', 'middle');// center

  // x-as toe
  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(8));

  // y-as toe
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('text')
    .remove()// voorkom dubbele text
    .style('text-anchor', 'end');
}

