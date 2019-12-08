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
})({"scripts/chart-02.js":[function(require,module,exports) {
"use strict";

var d3 = _interopRequireWildcard(require("d3"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var margin = {
  top: 50,
  left: 125,
  right: 20,
  bottom: 50
};
var height = 600 - margin.top - margin.bottom;
var width = 450 - margin.left - margin.right;
var svg = d3.select('#chart-02').append('svg').attr('height', height + margin.top + margin.bottom).attr('width', width + margin.left + margin.right).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var xPositionScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
var yPositionScale = d3.scaleBand().range([height, 0]).padding(0.25);
d3.csv(require('../data/orchestras.csv')).then(ready).catch(function (err) {
  return console.log('Failed on', err);
});

function ready(datapoints) {
  // Extract the year from the date column
  // Make sure points is a number
  datapoints.sort(function (a, b) {
    return a.pct_women - b.pct_women;
  });
  var instruments = datapoints.map(function (d) {
    return d.instrument;
  });
  yPositionScale.domain(instruments);
  svg.selectAll('.instrument-bg').data(datapoints).enter().append('rect').attr('class', 'instrument-bg').attr('y', function (d) {
    return yPositionScale(d.instrument);
  }).attr('x', 0).attr('height', yPositionScale.bandwidth()).attr('width', width).attr('fill', '#999999');
  svg.selectAll('.instrument').data(datapoints).enter().append('rect').attr('class', 'instrument').attr('y', function (d) {
    return yPositionScale(d.instrument);
  }).attr('x', 0).attr('height', yPositionScale.bandwidth()).attr('width', function (d) {
    return xPositionScale(d.pct_women);
  }).attr('fill', '#67bea2');
  var labels = ['Men', 'Women'];
  svg.selectAll('.gender-label').data(labels).enter().append('text').attr('class', 'gender-label').attr('y', yPositionScale('Flute')).attr('x', function (d) {
    if (d === 'Men') {
      return xPositionScale(80);
    } else {
      return xPositionScale(20);
    }
  }).attr('text-anchor', 'middle').attr('fill', 'white').attr('alignment-baseline', 'middle').attr('dy', yPositionScale.bandwidth() / 2).text(function (d) {
    return d;
  });
  svg.append('line').attr('class', 'halfway-line').attr('x1', xPositionScale(50)).attr('y1', 0).attr('x2', xPositionScale(50)).attr('y2', height).attr('stroke', 'white').attr('stroke-width', 2);
  var yAxis = d3.axisLeft(yPositionScale).tickSize(0).tickFormat(function (d) {
    return d;
  });
  svg.append('g').attr('class', 'axis y-axis').call(yAxis);
  svg.selectAll('.y-axis text').attr('fill', function (d) {
    if (d === 'Harp' || d == 'Flute' || d == 'Violin') {
      return '#67bea2';
    } else {
      return '#999999';
    }
  }).attr('dx', -10);
  var xAxis = d3.axisTop(xPositionScale).tickValues([20, 40, 60, 80]).tickFormat(function (d) {
    return d + '%';
  }).tickSize(-height);
  svg.append('g').attr('class', 'axis x-axis').call(xAxis).lower();
  svg.selectAll('.axis line').attr('stroke', '#ccc');
  svg.selectAll('.axis path').attr('stroke', 'none');
  svg.selectAll('.axis text').attr('font-size', 18);
  svg.selectAll('.x-axis text').attr('fill', '#999999');

  function render() {
    // Grabbing the div that our svg is inside of
    // and asking it wide it is
    // "hey <svg> that is really a <g>, go through
    // your parents until you find a div"
    var svgContainer = svg.node().closest('div');
    var svgWidth = svgContainer.offsetWidth;
    var svgHeight = window.innerHeight; // If you don't want the height to change, use this
    // const newHeight = height + margin.top + margin.bottom
    // Update the height of our SVG with svgHeight
    // Create a newHeight variable using svgHeight
    // Use the newHeight variabe to update our yPositionScale
    // Reposition the y position of our rectangles using the yPositionScale
    // Update the height of our rectangles

    console.log(svgWidth); // .node() means "no really give me the HTML element,
    //    not the weird d3 representation"
    // .parentNode means "give me the svg that's outside
    //    of the g," which we can actually change
    //    the size of with .attr
    // .closest('svg') means "go through your parents until
    //   you find an svg, in case we have a g in a g in a g"

    var actualSvg = d3.select(svg.node().closest('svg'));
    actualSvg.attr('width', svgWidth).attr('height', svgHeight); // Remember how we do
    //    var width = 700 - margin.left - margin.right?
    // this is the same thing, since svgWidth is the FULL
    // SIZE of the svg, not the drawing area (the g)

    var newWidth = svgWidth - margin.left - margin.right;
    var newHeight = svgHeight - margin.top - margin.bottom; // If you don't want the height to change, use this
    // const newHeight = height + margin.top + margin.bottom
    // Update our axes
    // First, update the scale
    // Then, update the axis

    xPositionScale.range([0, newWidth]);
    yPositionScale.range([newHeight, 0]);
    svg.select('.x-axis').call(xAxis);
    svg.select('.y-axis').call(yAxis); // Find everything that needs to be updated
    // like widths
    // and update them!

    svg.selectAll('.instrument').attr('width', function (d) {
      return xPositionScale(d.pct_women);
    }).attr('height', yPositionScale.bandwidth()).attr('y', function (d) {
      return yPositionScale(d.instrument);
    });
    svg.selectAll('.instrument-bg').attr('width', newWidth).attr('height', yPositionScale.bandwidth()).attr('y', function (d) {
      return yPositionScale(d.instrument);
    }); // Update the midpoint line

    svg.select('.halfway-line').attr('x1', xPositionScale(50)).attr('y1', 0).attr('x2', xPositionScale(50)).attr('y2', newHeight);

    if (newHeight < 500) {
      svg.selectAll('text').attr('font-size', 12);
    } else {
      svg.selectAll('text').attr('font-size', 14);
    } // Put the gender labels where they went before


    svg.selectAll('.gender-label').attr('y', yPositionScale('Flute')).attr('dy', yPositionScale.bandwidth() / 2).attr('x', function (d) {
      if (d === 'Men') {
        return xPositionScale(80);
      } else {
        return xPositionScale(20);
      }
    });
  } // When the window resizes, run the function
  // that redraws everything


  window.addEventListener('resize', render); // And now that the page has loaded, let's just try
  // to do it once before the page has resized

  render();
}
},{}]},{},["scripts/chart-02.js"], null)
//# sourceMappingURL=/chart-02.92076419.js.map