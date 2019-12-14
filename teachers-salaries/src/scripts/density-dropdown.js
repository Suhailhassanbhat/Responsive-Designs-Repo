

var stateFields = ['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018'];
    
d3.csv(require('/data/salaries-statewise.csv'), function(error, data) {

    var salaryMap = {};
    data.forEach(function(d) {
        var state = d.states;
        salaryMap[state] = [];

        stateFields.forEach(function(field) {
            salaryMap[state].push( +d[field] );
        });
    });
    makeVis(salaryMap);

});



var makeVis = function(salaryMap) {
    // Define dimensions of vis
    var margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width  = 800 - margin.left - margin.right,
        height = 600 - margin.top  - margin.bottom;

    // Make x scale
    var xScale = d3.scale.ordinal()
        .domain(stateFields)
        .rangeRoundBands([0, width], 0.1);

    // Make y scale, the domain will be defined on bar update
    var yScale = d3.scale.linear()
        .domain([-25, 25])
        .range([height, 0]);

    console.log(xScale(30))

    // Create canvas
    var canvas = d3.select("#my_dataviz")
      .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Make x-axis and add to canvas
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis);

    // Make y-axis and add to canvas
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var yAxisHandleForUpdate = canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    yAxisHandleForUpdate.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .text("Percent change");

    var updateBars = function(data) {


        yAxisHandleForUpdate.call(yAxis);

        var bars = canvas.selectAll(".bar").data(data);

        // Add bars for new data
        bars.enter()
          .append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return xScale( stateFields[i] ); })            .attr("width", 20)
            .attr("y", function(d,i) { return yScale(d); })
            .attr("height", function(d,i) { return height/2 - yScale(d); });
       

        // Update old ones, already have x / width from before
        bars
            .transition().duration(250)
            .attr("y", function(d,i) { return yScale(d); })
            .attr("height", function(d,i) { return height/2 - yScale(d); });

        // Remove old ones
        bars.exit().remove();
    };

    // Handler for dropdown value change
    var dropdownChange = function() {
        var newState = d3.select(this).property('value'),
            newData   = salaryMap[newState];

        updateBars(newData);
    };

    var salaries = Object.keys(salaryMap).sort();

    var dropdown = d3.select("#my_dataviz")
        .insert("select", "svg")
        .on("change", dropdownChange);

    dropdown.selectAll("option")
        .data(salaries)
      .enter().append("option")
        .attr("value", function (d) { return d; })
        .text(function (d) {    
            return d
        });

    var initialData = salaryMap[ salaries[0] ];
    updateBars(initialData);
};
