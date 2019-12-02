import * as d3 from 'd3'

const margin = { top: 50, left: 125, right: 20, bottom: 50 }

const height = 600 - margin.top - margin.bottom
const width = 450 - margin.left - margin.right

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, width])

const yPositionScale = d3
  .scaleBand()
  .range([height, 0])
  .padding(0.25)

d3.csv(require('../data/orchestras.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // Extract the year from the date column
  // Make sure points is a number

  datapoints.sort((a, b) => a.pct_women - b.pct_women)

  const instruments = datapoints.map(d => d.instrument)
  yPositionScale.domain(instruments)

  svg
    .selectAll('.instrument-bg')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('class', 'instrument-bg')
    .attr('y', d => yPositionScale(d.instrument))
    .attr('x', 0)
    .attr('height', yPositionScale.bandwidth())
    .attr('width', width)
    .attr('fill', '#999999')

  svg
    .selectAll('.instrument')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('class', 'instrument')
    .attr('y', d => yPositionScale(d.instrument))
    .attr('x', 0)
    .attr('height', yPositionScale.bandwidth())
    .attr('width', d => xPositionScale(d.pct_women))
    .attr('fill', '#67bea2')

  const labels = ['Men', 'Women']

  svg
    .selectAll('.gender-label')
    .data(labels)
    .enter()
    .append('text')
    .attr('class', 'gender-label')
    .attr('y', yPositionScale('Flute'))
    .attr('x', function(d) {
      if (d === 'Men') {
        return xPositionScale(80)
      } else {
        return xPositionScale(20)
      }
    })
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('alignment-baseline', 'middle')
    .attr('dy', yPositionScale.bandwidth() / 2)
    .text(d => d)

  svg
    .append('line')
    .attr('class', 'halfway-line')
    .attr('x1', xPositionScale(50))
    .attr('y1', 0)
    .attr('x2', xPositionScale(50))
    .attr('y2', height)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(0)
    .tickFormat(d => d)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg
    .selectAll('.y-axis text')
    .attr('fill', d => {
      if (d === 'Harp' || d == 'Flute' || d == 'Violin') {
        return '#67bea2'
      } else {
        return '#999999'
      }
    })
    .attr('dx', -10)

  const xAxis = d3
    .axisTop(xPositionScale)
    .tickValues([20, 40, 60, 80])
    .tickFormat(d => d + '%')
    .tickSize(-height)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .call(xAxis)
    .lower()

  svg.selectAll('.axis line').attr('stroke', '#ccc')
  svg.selectAll('.axis path').attr('stroke', 'none')

  svg.selectAll('.axis text').attr('font-size', 18)
  svg.selectAll('.x-axis text').attr('fill', '#999999')

  function render() {
    // Grabbing the div that our svg is inside of
    // and asking it wide it is
    // "hey <svg> that is really a <g>, go through
    // your parents until you find a div"
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = window.innerHeight
    // If you don't want the height to change, use this
    // const newHeight = height + margin.top + margin.bottom

    // Update the height of our SVG with svgHeight
    // Create a newHeight variable using svgHeight
    // Use the newHeight variabe to update our yPositionScale
    // Reposition the y position of our rectangles using the yPositionScale
    // Update the height of our rectangles

    console.log(svgWidth)

    // .node() means "no really give me the HTML element,
    //    not the weird d3 representation"
    // .parentNode means "give me the svg that's outside
    //    of the g," which we can actually change
    //    the size of with .attr
    // .closest('svg') means "go through your parents until
    //   you find an svg, in case we have a g in a g in a g"
    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)

    // Remember how we do
    //    var width = 700 - margin.left - margin.right?
    // this is the same thing, since svgWidth is the FULL
    // SIZE of the svg, not the drawing area (the g)
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom
    // If you don't want the height to change, use this
    // const newHeight = height + margin.top + margin.bottom

    // Update our axes
    // First, update the scale
    // Then, update the axis
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)

    // Find everything that needs to be updated
    // like widths
    // and update them!
    svg
      .selectAll('.instrument')
      .attr('width', d => xPositionScale(d.pct_women))
      .attr('height', yPositionScale.bandwidth())
      .attr('y', d => yPositionScale(d.instrument))

    svg
      .selectAll('.instrument-bg')
      .attr('width', newWidth)
      .attr('height', yPositionScale.bandwidth())
      .attr('y', d => yPositionScale(d.instrument))

    // Update the midpoint line
    svg
      .select('.halfway-line')
      .attr('x1', xPositionScale(50))
      .attr('y1', 0)
      .attr('x2', xPositionScale(50))
      .attr('y2', newHeight)

    if (newHeight < 500) {
      svg.selectAll('text').attr('font-size', 12)
    } else {
      svg.selectAll('text').attr('font-size', 14)
    }

    // Put the gender labels where they went before
    svg
      .selectAll('.gender-label')
      .attr('y', yPositionScale('Flute'))
      .attr('dy', yPositionScale.bandwidth() / 2)
      .attr('x', function(d) {
        if (d === 'Men') {
          return xPositionScale(80)
        } else {
          return xPositionScale(20)
        }
      })
  }

  // When the window resizes, run the function
  // that redraws everything
  window.addEventListener('resize', render)

  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
