// import * as d3 from 'd3'

var margin = {top: 30, right: 30, bottom: 30, left: 50}
    width = 460 - margin.left - margin.right
    height = 400 - margin.top - margin.bottom

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

// load data and make sure data is working
// update scales and variables
//finally bar charts
//update axis
// change CSS
// get the data

// d3.csv(require('../data/total-salaries.csv'))
//   .then(ready)
//   .catch(err => console.log('Failed on', err))
d3.csv("https://raw.githubusercontent.com/Suhailhassanbhat/Responsive-Designs-Repo/master/teachers-salaries/src/data/total-salaries.csv", function(data) {


    console.log(data)
  // List of groups (here I have one group per column)
  var allGroup = d3.map(data, function(d){return(d.Year)}).keys()

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // add the x Axis
  var x = d3.scaleLinear()
    .domain([-10, 12])
    .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  var y = d3.scaleLinear()
            .range([height, 0])
            .domain([-10, 10]);
  svg.append("g")
      .call(d3.axisLeft(y));

  // Compute kernel density estimation for the first group called Setosa
  var kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(140))
  var density =  kde( data
    .filter(function(d){ return d.Year == "2018"})
    .map(function(d){  return +d.Alabama; })
  )

  // Plot the area
  var curve = svg
    .append('g')
    .append("rect")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("width", 10)
      .attr("height", function(d){
          return +d.Year
      })

  // A function that update the chart when slider is moved?
  function updateChart(selectedGroup) {
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40))
    var density =  kde( data
      .filter(function(d){ return d.Year == selectedGroup})
      .map(function(d){  return +d.Alabama; })
    )

    // update the chart
    // curve
    //   .datum(density)
    //   .transition()
    //   .duration(1000)
    //   .attr("d",  d3.line()
    //     .curve(d3.curveBasis)
    //       .x(function(d) { return x(d[0]); })
    //       .y(function(d) { return y(d[1]); })
    //   );
  }

  // Listen to the slider?
  d3.select("#selectButton").on("change", function(d){
    selectedGroup = this.value
    updateChart(selectedGroup)
  })

});


// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

