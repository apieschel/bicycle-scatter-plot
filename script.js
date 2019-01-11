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
    const padding = 50;
    
    let dates = []
    
    for(let i = 0; i < dataset.length; i++) {
      dates.push(dataset[i].Year);
    }
    console.log(dates); 
    const minX = d3.min(dates, (d) => d);
    const maxX = d3.max(dates, (d) => d);
    console.log(maxX);
    const xScale = d3.scaleLinear()
                      .domain([minX, maxX + 1])
                      .range([padding, w - padding]);
    
    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format("d"));
    
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
