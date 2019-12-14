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
})({"data/salaries-statewise.csv":[function(require,module,exports) {
module.exports = "/salaries-statewise.c0e6ec0e.csv";
},{}],"scripts/density-dropdown.js":[function(require,module,exports) {
var stateFields = ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'];
d3.csv(require('/data/salaries-statewise.csv'), function (error, data) {
  var salaryMap = {};
  data.forEach(function (d) {
    var state = d.states;
    salaryMap[state] = [];
    stateFields.forEach(function (field) {
      salaryMap[state].push(+d[field]);
    });
  });
  makeVis(salaryMap);
});

var makeVis = function makeVis(salaryMap) {
  // Define dimensions of vis
  var margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom; // Make x scale

  var xScale = d3.scale.ordinal().domain(stateFields).rangeRoundBands([0, width], 0.1); // Make y scale, the domain will be defined on bar update

  var yScale = d3.scale.linear().domain([-25, 25]).range([height, 0]);
  console.log(xScale(30)); // Create canvas

  var canvas = d3.select("#my_dataviz").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Make x-axis and add to canvas

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  canvas.append("g").attr("class", "x axis").attr("transform", "translate(0," + height / 2 + ")").call(xAxis); // Make y-axis and add to canvas

  var yAxis = d3.svg.axis().scale(yScale).orient("left");
  var yAxisHandleForUpdate = canvas.append("g").attr("class", "y axis").call(yAxis);
  yAxisHandleForUpdate.append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").style("font-size", 10).text("Percent change");

  var updateBars = function updateBars(data) {
    yAxisHandleForUpdate.call(yAxis);
    var bars = canvas.selectAll(".bar").data(data); // Add bars for new data

    bars.enter().append("rect").attr("class", "bar").attr("x", function (d, i) {
      return xScale(stateFields[i]);
    }).attr("width", 20).attr("y", function (d, i) {
      return yScale(d);
    }).attr("height", function (d, i) {
      return height / 2 - yScale(d);
    }); // Update old ones, already have x / width from before

    bars.transition().duration(250).attr("y", function (d, i) {
      return yScale(d);
    }).attr("height", function (d, i) {
      return height / 2 - yScale(d);
    }); // Remove old ones

    bars.exit().remove();
  }; // Handler for dropdown value change


  var dropdownChange = function dropdownChange() {
    var newState = d3.select(this).property('value'),
        newData = salaryMap[newState];
    updateBars(newData);
  };

  var salaries = Object.keys(salaryMap).sort();
  var dropdown = d3.select("#my_dataviz").insert("select", "svg").on("change", dropdownChange);
  dropdown.selectAll("option").data(salaries).enter().append("option").attr("value", function (d) {
    return d;
  }).text(function (d) {
    return d;
  });
  var initialData = salaryMap[salaries[0]];
  updateBars(initialData);
};
},{"/data/salaries-statewise.csv":"data/salaries-statewise.csv"}]},{},["scripts/density-dropdown.js"], null)
//# sourceMappingURL=/density-dropdown.ca0ea5dd.js.map