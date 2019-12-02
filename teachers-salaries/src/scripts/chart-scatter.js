import * as d3 from 'd3'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const width = 500 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom
// You'll probably need to edit this one
const svg = d3
  .select('#chart-scatter')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// Here are some scales for you
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 80000])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([30, 85])
  .range([height, 0])
const colorScale = d3
  .scaleOrdinal()
  .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'])
d3.csv(require('../data/countries.csv')).then(ready)
function ready(datapoints) {
  console.log('Data is....', datapoints)
  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', d => xPositionScale(d.gdp_per_capita))
    .attr('cy', d => yPositionScale(d.life_expectancy))
    .attr('fill', d => colorScale(d.continent))
    // "S. America" can't be a class we removed non-word chars and lowercase it
    // S. America -> SAmerica -> samerica
    .attr('class', d => d.continent.replace(/[^\w]/g, '').toLowerCase())
    .classed('country-circle', true)
    .on('mouseover', function(d) {
      console.log('ok')
      d3.select(this).attr('stroke', 'black')
    })
    .on('mouseout', function(d) {
      console.log('ok2')
      d3.select(this).attr('stroke', 'none')
    })
  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()
  d3.select('.y-axis .domain').remove()
  const xAxis = d3
    .axisBottom(xPositionScale)
    .ticks(5)
    .tickFormat(d3.format('$,'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  /* 
  Buttons to click
  */
  d3.select('#reset-step').on('stepin', function() {
    svg.selectAll('circle').attr('fill', d => colorScale(d.continent))
  })
  d3.select('#asia-step').on('stepin', function() {
    svg.selectAll('circle').attr('fill', 'lightgrey')
    svg
      .selectAll('.asia')
      .attr('fill', 'red')
      .raise()
  })
  d3.select('#sa-step')
    .on('stepin', function() {
      svg.selectAll('circle').attr('fill', 'lightgrey')
      svg
        .selectAll('.samerica')
        .attr('fill', 'red')
        .raise()
      svg
        .selectAll('circle')
        .attr('fill', function(d) {
          if (d.continent === 'S. America') {
            return 'red'
          } else {
            return 'lightgrey'
          }
        })
        .raise()

      xPositionScale.domain([0, 15000])
      yPositionScale.domain([60, 85])

      render()
    })
    .on('stepout', function() {
      xPositionScale.domain([0, 80000])
      yPositionScale.domain([30, 85])

      // Now that you've redrawn the scale, redraw everything
      render()
    })
  /* 
  Responsive design render function
  */
  function render() {
    console.log('rendering')
    // This section will always be the same (except the last line, maybe)
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = window.innerHeight
    // If you don't want the height to change, use this
    // const newHeight = height + margin.top + margin.bottom
    // always be the same
    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)
    // always be the same
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom
    // Update your scales - almost always be the same
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])
    // Maybe have fewer axis ticks if the window is smaller
    if (svgWidth < 400) {
      xAxis.ticks(2)
    } else if (svgWidth < 550) {
      xAxis.ticks(4)
    } else {
      xAxis.ticks(null)
    }
    // Update your axes - almost always the same
    svg
      .select('.y-axis')
      .transition()
      .call(yAxis)
    svg
      .select('.x-axis')
      .transition()
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)
    // Update your data points
    svg
      .selectAll('.country-circle')
      .transition()
      .ease(d3.easeElastic)
      .attr('cy', d => yPositionScale(d.life_expectancy))
      .attr('cx', d => xPositionScale(d.gdp_per_capita))
  }
  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)
  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
