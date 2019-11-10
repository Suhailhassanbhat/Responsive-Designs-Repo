import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 500 - margin.top - margin.bottom
const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-4b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoAlbersUsa()
const path = d3.geoPath().projection(projection)

const colorScale = d3
  .scaleOrdinal()
  .domain(['OBAMA', 'ROMNEY'])
  .range(['green', 'purple'])

d3.json(require('/data/counties.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  // console.log('What is our data?')
  // console.log(json)

  const counties = topojson.feature(json, json.objects.elpo12p010g)
  // const maxPop = d3.max(d => counties.feature.properties.TTL_VT)

  // const ramp = d3
  //   .scaleLinear()
  //   .domain([0, maxPop])
  //   .range([0, 1])

  // const colorScale = d3
  //   .scaleSequential(d3.interpolatePiYG)
  //   .domain(d => d.properties.WINNER)

  svg
    .selectAll('path')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('d', path)
    .attr('fill', d => {
      return colorScale(d.properties.WINNER)
    })
    .attr('opacity', function(d) {
      return d.properties.TTL_VT / 100000
    })
}
