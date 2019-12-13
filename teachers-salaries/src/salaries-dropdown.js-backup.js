// import * as d3 from 'd3'

var margin = {top: 30, right: 30, bottom: 30, left: 50}
    width = 600 - margin.left - margin.right
    height = 600 - margin.top - margin.bottom

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

d3.csv("https://raw.githubusercontent.com/Suhailhassanbhat/Responsive-Designs-Repo/master/teachers-salaries/src/data/total-salaries.csv", function(data) {

    // const states = data.columns.splice(1, data.columns.length - 1)
    // const newData = []
    // data.forEach(function(d) {
    //     for( var i = 0; i < states.length; i++) {
    //         const row = {}
    //         const current = states[i]
    //         row.state = current
    //         row.year = +d.Year
    //         row.value = +d[current]

    //         newData.push(row)
    //     }
    // })
    // // console.log("new data", newData)
    // const nested = d3.nest().key(d => d.year).entries(newData)
    // console.log("this is my nested data", nested)

 
    var allGroup = d3.map(data, function(d){return(+d.Year)}).keys()

    console.log(data)

    var y = d3.scaleLinear()
      .domain( [-20, 20])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y))

    var x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height/2 + ")")
      .call(d3.axisBottom(x))

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d }) // text showed in the menu
    .attr("value", function (d) { return d }) // corresponding value returned by the button

  // Plot bars

  var line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Year) })
          .y(function(d) { return y(+d.Alabama) })
        )
        .attr("stroke", 'red')
        .style("stroke-width", 4)
        .style("fill", "none")

    function update(selectedGroup) {

        // Create new data with the selection?
        var dataFilter = data.map(function(d){return {year: d.Year, value:d[selectedGroup]} })
    
        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return x(+d.Year) })
                .y(function(d) { return y(+d.value) })
            )
            .attr("stroke", 'red')
        }
    
        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // run the updateChart function with this selected option
            update(selectedOption)
        })
    


    


})





