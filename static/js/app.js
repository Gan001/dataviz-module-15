function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(data){
    // Use `.html("") to clear any existing metadata
    d3.select('#sample-metadata').html('');
    // Use d3 to select the panel with id of `#sample-metadata`
    var table = d3.select('#sample-metadata');
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      var row = table.append("p");
      Object.entries(data).forEach(function([key, value]) {
        console.log(key, value);
        // Append a cell to the row for each value
        var cell = row.append("h6");
        cell.text(key + ":" + value);
      });
      buildGauge(data.WFREQ);
    });
    // BONUS: Build the Gauge Chart
   
}

function buildGauge(frequency){
  // Enter a speed between 0 and 180
var level = frequency*20;
console.log(`Frequency:${frequency}`);
// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var gauge_data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9, 50/9,50/9,50],
  rotation: 90,
  text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
            '1-2', '0-1'],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)','rgba(65, 178, 51, .5)','rgba(91, 204, 77, .5)','rgba(14, 127, 0, .5)','rgba(102, 127, 12, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(255, 255, 255, 1)']},
  
  
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var gauge_layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Gauge</b> <br> Speed 0-100',
  height: 600,
  width: 600,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', gauge_data, gauge_layout);
}

function buildCharts(sample) {
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){

    // @TODO: Build a Bubble Chart using the sample data
      
    //var bubbleChart = d3.select('#bubble');
    
    var bubbleData = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker:{size: data.sample_values, color:data.otu_ids},
      text: data.otu_labels
    }];
    var bubble_layout = {xaxis:{title: 'OTU', showline: false}, yaxis:{title: 'Sample values', showline: false}};
    console.log(bubbleData);
    Plotly.newPlot('bubble',bubbleData, bubble_layout);
    //console.log('hello');
    
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    //d3.select("#pie").html('');
    //var pieChart = d3.select("#pie");

    var pie_data =[{
              labels: data.otu_ids.slice(0,10),
              values: data.sample_values.sort((first, sec)=> {return sec-first;}).slice(0,10),
              hovertext: data.otu_labels,
              type: 'pie'
    }];
    
    var layout = {
      title: "Pie Chart",
      height: 400,
      width: 500
    };

    console.log(pie_data);
    //console.log("hello");
    Plotly.newPlot('pie',pie_data,layout);
    //d3.select("#selDataset").on('change',Plotly.restyle('pie',pie_data,layout));
    
    //console.log("bye");
  });
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

