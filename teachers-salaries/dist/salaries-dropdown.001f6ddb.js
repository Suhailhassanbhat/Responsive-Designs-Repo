// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/salaries-dropdown.js":[function(require,module,exports) {
// import * as d3 from 'd3'
var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 50
};
width = 460 - margin.left - margin.right;
height = 400 - margin.top - margin.bottom; // append the svg object to the body of the page

var svg = d3.select("#my_dataviz").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // load data and make sure data is working
// update scales and variables
//finally bar charts
//update axis
// change CSS
// get the data
// d3.csv(require('../data/total-salaries.csv'))
//   .then(ready)
//   .catch(err => console.log('Failed on', err))

d3.csv("https://raw.githubusercontent.com/Suhailhassanbhat/Responsive-Designs-Repo/master/teachers-salaries/src/data/total-salaries.csv", function (data) {
  console.log(data); // List of groups (here I have one group per column)

  var allGroup = d3.map(data, function (d) {
    return d.Year;
  }).keys(); // add the options to the button

  d3.select("#selectButton").selectAll('myOptions').data(allGroup).enter().append('option').text(function (d) {
    return d;
  }) // text showed in the menu
  .attr("value", function (d) {
    return d;
  }); // corresponding value returned by the button
  // add the x Axis

  var x = d3.scaleLinear().domain([-10, 12]).range([0, width]);
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // add the y Axis

  var y = d3.scaleLinear().range([height, 0]).domain([-10, 10]);
  svg.append("g").call(d3.axisLeft(y)); // Compute kernel density estimation for the first group called Setosa

  var kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(140));
  var density = kde(data.filter(function (d) {
    return d.Year == "2018";
  }).map(function (d) {
    return +d.Alabama;
  })); // Plot the area

  var curve = svg.append('g').append("rect").attr("class", "mypath").datum(density).attr("fill", "#69b3a2").attr("opacity", ".8").attr("stroke", "#000").attr("stroke-width", 1).attr("stroke-linejoin", "round").attr("width", 10).attr("height", function (d) {
    return +d.Year;
  }); // A function that update the chart when slider is moved?

  function updateChart(selectedGroup) {
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(3), x.ticks(40));
    var density = kde(data.filter(function (d) {
      return d.Year == selectedGroup;
    }).map(function (d) {
      return +d.Alabama;
    })); // update the chart
    // curve
    //   .datum(density)
    //   .transition()
    //   .duration(1000)
    //   .attr("d",  d3.line()
    //     .curve(d3.curveBasis)
    //       .x(function(d) { return x(d[0]); })
    //       .y(function(d) { return y(d[1]); })
    //   );
  } // Listen to the slider?


  d3.select("#selectButton").on("change", function (d) {
    selectedGroup = this.value;
    updateChart(selectedGroup);
  });
}); // Function to compute density

function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [x, d3.mean(V, function (v) {
        return kernel(x - v);
      })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
},{}]},{},["scripts/salaries-dropdown.js"], null)
//# sourceMappingURL=/salaries-dropdown.001f6ddb.js.map