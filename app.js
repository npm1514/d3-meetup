var app = angular.module("meetup", [])
.controller("mainCtrl", function(){
  var candidateData = [];
 var width = window.screen.width,
   height = window.screen.height;

 var parseDate = d3.time.format("%m/%d/%Y").parse;

 var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

 d3.json("https://spreadsheets.google.com/feeds/list/1ldYMu_1u-C-2Cj9u9UOCDfgMEcza3GVhhcpZCkw9FY0/od6/public/basic?alt=json", function(error, json) {

   candidateData = buildData(json.feed.entry)
     .filter(d => d.poll === 'IBD/TIPP');
   draw(candidateData);
 });

 function draw(data) {
   // TODO???
     var candidateList = d3
        .map(data, function(d) {
          return d.candidate;
        }).keys();

     // TODO???
     var x = d3.time.scale()
       .range([0, width])
       .domain(d3.extent(data, function(d) {
         return parseDate(d.date);
       }));

     // TODO???
     var y = d3.scale.linear()
       .range([height, 0])
       .domain([0, 100]);

     // TODO???
     var color = d3.scale.category20()
       .domain(candidateList);

     // Optional
     var xAxis = d3.svg.axis()
       .scale(x)
       .orient("bottom");

     // Optional
     var yAxis = d3.svg.axis()
       .scale(y)
       .orient("left");

     // TODO
     var area = d3.svg.area()
       .x(function(d) {
         console.log(d);
         return x(d.date);
       })
       .y0(function(d) {
         return y(d.y0);
       })
       .y1(function(d) {
         return y(d.y0 + d.y);
       });

     // TODO
     var stack = d3.layout.stack()
       .values(function(d) {
         return d.values;
       });

     // TODO
     var candidates = stack(candidateList.map(function(candidateName) {
       return {
         name: candidateName,
         values: data.filter(function(data) {
           return data.candidate === candidateName;
         }).map(function(d) {
           return {
             date: parseDate(d.date),
             y: Number(d.popularity)
           };
         })
       };
     }));

     // TODO
     var candidate = svg.selectAll(".candidate")
       .data(candidates)
       .enter().append("g")
       .attr("class", "candidate");

     // TODO
     candidate.append("path")
       .attr("class", "area")
       .attr("d", function(d) {
         return area(d.values);
       })
       .style("fill", function(d) {
         return color(d.name);
       });

     // Optional
     candidate.append("text")
       .datum(function(d) {
         return {
           name: d.name,
           value: d.values[d.values.length - 1]
         };
       })
       .attr("transform", function(d) {
         return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")";
       })
       .attr("x", -6)
       .attr("dy", ".35em")
       .text(function(d) {
         return d.name;
       });

     // Optional
     svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

     // Optional
     svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);
 }

 function buildData(inputData) {
   var tempObj = {};
   var split1;
   var split2;
   var results = [];

   for (var i = 0; i < inputData.length; i++) {
     tempObj = {};
     split1 = [];
     split2 = [];
     split1 = inputData[i].content.$t.split(',');
     split1.forEach(function(pair) {
       split2 = pair.split(':');
       tempObj[split2[0].trim()] = split2[1].trim();
     });
     tempObj.date = inputData[i].title.$t;

     results.push(tempObj);
   }

   return results;
 }
});
