/* globals d3 */
let dataset = [];
const xhr = new XMLHttpRequest();
const callback = function(err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    dataset = data;
    console.log(dataset);
    
    const w = 1200
    const h = 750;
    const padding = 60;
    
    let dates = [];
    let times = [];
    let datesAndTimes = [];
    let specifier = "%M:%S";
    
    // Formating minutes and seconds on a D3 axis: https://stackoverflow.com/questions/50690567/formating-minutes-and-seconds-on-a-d3-axis
    for(let i = 0; i < dataset.length; i++) {
      dates.push(dataset[i].Year);
      times.push(d3.timeParse(specifier)(dataset[i].Time));
      datesAndTimes.push([dataset[i].Year, d3.timeParse(specifier)(dataset[i].Time), dataset[i].Doping, dataset[i].Time, dataset[i].Name]);
    }
    
    const minX = d3.min(dates, (d) => d);
    const maxX = d3.max(dates, (d) => d);
    const xScale = d3.scaleLinear()
                      .domain([minX, maxX + 1])
                      .range([padding, w - padding]);
    
    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format("d"));
    
    console.log(times);
    console.log(datesAndTimes);
    const minY = d3.min(times, (d) => d);
    const maxY = d3.max(times, (d) => d);
    const yScale = d3.scaleTime()
                      .domain(d3.extent(times, function(d) {
                        return d;
                      }))
                      .range([20, h - padding]);
    const yAxis = d3.axisLeft(yScale)
                      .tickFormat(d3.timeFormat(specifier));
    
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0)
    
    d3.select("body")
      .append("h1")
      .attr("id", "title")
      .text("Doping in Professional Bicycle Racing");
    
    const svg = d3.select(".container")
      .append("svg")
      .attr("width", w)
      .attr("height", h);
    
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);
    
    svg.append("g")
        .attr("transform", "translate(" + padding + ", 0)")
        .attr("id", "y-axis")
        .call(yAxis);
    
    svg.selectAll("circle")
       .data(datesAndTimes)
       .enter()
       .append("circle")
       .attr("cx", (d) => xScale(d[0]))
       .attr("cy", (d) => yScale(d[1]))
       .attr("r", 5)
       .attr("class", "dot")
       .attr("data-xvalue", (d) => d[0])
       .attr("data-yvalue", (d) => d[1])
       .attr("fill", (d) => {
          if(d[2] === "") {
            return "darkcyan";
          } else {
            return "red";
          }
        })
       .on("mouseover", function(d) {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0.85);
          tooltip
            .html("<p>" + d[4] + "</p><p><strong>Year:</strong> " + d[0] + "</p><p><strong>Time:</strong> " + d[3] + "</p><p>" + d[2] + "</p>")
            .style("left", d3.event.pageX + 15 + "px")
            .style("top", d3.event.pageY + 15 + "px");
          tooltip.attr("data-year", d[0]);
        })
        .on("mouseout", function(d) {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        });
    
    let legend = svg.append("g")
                    .attr("id", "legend");
      
    legend.append("rect")
      .attr("x", w - padding)
      .attr("y", h / 2)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "red")
      
    legend.append("text")
      .text("Doping allegations")
      .attr("x", w - padding - 160)
      .attr("y", (h / 2) + 10)
    
    legend.append("rect")
      .attr("x", w - padding)
      .attr("y", (h / 2) - 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", "darkcyan")
      
    legend.append("text")
      .text("No doping allegations")
      .attr("x", w - padding - 160)
      .attr("y", (h / 2) - 10)
    
    
  }
}
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
xhr.responseType = 'json';
xhr.onload = function() {
  var status = xhr.status;
  if (status === 200) {
    callback(null, xhr.response);
  } else {
    callback(status, xhr.response);
  }
};
xhr.send();