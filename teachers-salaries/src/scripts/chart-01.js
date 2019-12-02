import * as d3 from 'd3'
import * as topojson from 'topojson'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 0, left: 0, right: 0, bottom: 10 }
const height = 500 - margin.top - margin.bottom
const width = 750 - margin.left - margin.right

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoAlbersUsa()

const path = d3.geoPath().projection(projection)

d3.json(require('/data/salaries.json'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  const states = topojson.feature(json, json.objects.salaries)
  console.log(json)

  const formatComma = d3.format(',')
  const tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .style('position', 'fixed')
    .offset([10, 30])
    .html(function(d) {
      return `<b>${
        d.properties.NAME
      }</b> <br>  <b>Starting Salary:</b> <span style='color:red'>$${formatComma(d.properties.teacher_sa)}</span>`
    })
  svg.call(tip)

  projection.fitSize([width, height], states)

  svg
    .selectAll('path')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', function(d) {
      if (+d.properties.teacher_sa < 35000) {
        return '#DCECF5'
      }
      if (+d.properties.teacher_sa < 40000) {
        return '#C9E3F0'
      }
      if (+d.properties.teacher_sa < 45000) {
        return '#9CCDE4'
      }
      if (+d.properties.teacher_sa < 50000) {
        return '#6FB9D8'
      }
      if (+d.properties.teacher_sa < 55000) {
        return '#3AA7CC'
      }
      if (+d.properties.teacher_sa < 60000) {
        return '#0097C1'
      }
    })
    .on('mouseenter', function() {
      d3.select(this)
        .raise()
        .transition()
        .style('transform', 'scale(1.15,1.15)')
        .attr('stroke', '#333')
    })
    .on('mouseleave', function() {
      d3.select(this)
        .lower()
        .transition()
        .style('transform', 'scale(1,1)')
        .attr('stroke', 'none')
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // STEP FUNCTIONS START HERE
  // ---------------------------------------------------------------------------------

  d3.select('#step').on('stepin', function() {
    svg.selectAll('path').attr('fill', function(d) {
      if (+d.properties.teacher_sa < 35000) {
        return '#DCECF5'
      }
      if (+d.properties.teacher_sa < 40000) {
        return '#C9E3F0'
      }
      if (+d.properties.teacher_sa < 45000) {
        return '#9CCDE4'
      }
      if (+d.properties.teacher_sa < 50000) {
        return '#6FB9D8'
      }
      if (+d.properties.teacher_sa < 55000) {
        return '#3AA7CC'
      }
      if (+d.properties.teacher_sa < 60000) {
        return '#0097C1'
      }
    })
  })
  // ---------------------------------------------------------------------------------
  d3.select('#indiana-step').on('stepin', function() {
    svg
      .selectAll('path')
      .attr('fill', function(d) {
        if (d.properties.NAME === 'Indiana') {
          return 'red'
        }
        if (+d.properties.teacher_sa < 35000) {
          return '#DCECF5'
        }
        if (+d.properties.teacher_sa < 40000) {
          return '#C9E3F0'
        }
        if (+d.properties.teacher_sa < 45000) {
          return '#9CCDE4'
        }
        if (+d.properties.teacher_sa < 50000) {
          return '#6FB9D8'
        }
        if (+d.properties.teacher_sa < 55000) {
          return '#3AA7CC'
        }
        if (+d.properties.teacher_sa < 60000) {
          return '#0097C1'
        }
      })
      .on('mouseenter', function() {
        d3.select(this)
          .raise()
          .transition()
          .style('transform', 'scale(1.15,1.15)')
          .attr('stroke', '#333')
      })
      .on('mouseleave', function() {
        d3.select(this)
          .lower()
          .transition()
          .style('transform', 'scale(1,1)')
          .attr('stroke', 'none')
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    svg.call(tip)
  })
  // // ---------------------------------------------------------------------------------
  d3.select('#indiana-step').on('stepout', function() {
    svg
      .selectAll('path')
      .attr('fill', function(d) {
        if (+d.properties.teacher_sa < 35000) {
          return '#DCECF5'
        }
        if (+d.properties.teacher_sa < 40000) {
          return '#C9E3F0'
        }
        if (+d.properties.teacher_sa < 45000) {
          return '#9CCDE4'
        }
        if (+d.properties.teacher_sa < 50000) {
          return '#6FB9D8'
        }
        if (+d.properties.teacher_sa < 55000) {
          return '#3AA7CC'
        }
        if (+d.properties.teacher_sa < 60000) {
          return '#0097C1'
        }
      })
      .on('mouseenter', function() {
        d3.select(this)
          .raise()
          .transition()
          .style('transform', 'scale(1.15,1.15)')
          .attr('stroke', '#333')
      })
      .on('mouseleave', function() {
        d3.select(this)
          .lower()
          .transition()
          .style('transform', 'scale(1,1)')
          .attr('stroke', 'none')
      })
  })
  // // ---------------------------------------------------------------------------------

  d3.select('#above-indiana-step').on('stepin', function() {
    svg
      .selectAll('path')
      .attr('fill', function(d) {
        if (d.properties.NAME === 'Indiana') {
          return 'red'
        }
        if (d.properties.teacher_sa > 35943) {
          return 'blue'
        } else {
          return 'lightpink'
        }
      })
      .on('mouseenter', function() {
        d3.select(this)
          .raise()
          .transition()
          .style('transform', 'scale(1.15,1.15)')
          .attr('stroke', '#333')
      })
      .on('mouseleave', function() {
        d3.select(this)
          .lower()
          .transition()
          .style('transform', 'scale(1,1)')
          .attr('stroke', 'none')
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    svg.call(tip)
  })
  // -------------------------------------------------------

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = height + margin.top + margin.bottom
    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom
    // Update our scale
    projection.fitSize([newWidth, newHeight], states)
    // Update things you draw
    svg.selectAll('.country').attr('d', path)

    svg.call(tip)
  }
  window.addEventListener('resize', render)
  render()
}
