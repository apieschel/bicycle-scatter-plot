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
    
    let dates = [];
    let times = [];
    let regexp = /:/;
    
    for(let i = 0; i < dataset.length; i++) {
      let index = regexp.exec(dataset[i].Time).index;
      console.log(index);
      let minutes = parseInt(dataset[i].Time.substring(0, index));
      console.log(minutes);
      let seconds = parseInt(dataset[i].Time.substring(index + 1,));
      console.log(seconds);
      seconds = minutes * 60 + seconds;
      dates.push(dataset[i].Year);
      times.push(seconds);
    }
    
    const minX = d3.min(dates, (d) => d);
    const maxX = d3.max(dates, (d) => d);
    const xScale = d3.scaleLinear()
                      .domain([minX, maxX + 1])
                      .range([padding, w - padding]);
    
    const xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format("d"));
    
    console.log(times);
    const minY = d3.min(times, (d) => d);
    const maxY = d3.max(times, (d) => d);
    const yScale = d3.scaleLinear()
                         .domain([0, maxY])
                         .range([h - padding, 0]);
    const yAxis = d3.axisLeft(yScale);
    
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
