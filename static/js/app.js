function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(data){

    // Use `.html("") to clear any existing metadata
    d3.select('#sample-metadata').html('');

    // Use d3 to select the panel with id of `#sample-metadata`
    var table = d3.select('#sample-metadata');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      var row = table.append("div");
      Object.entries(data).forEach(function([key, value]) {
        console.log(key, value);
        // Append a cell to the row for each value
        var cell = row.append("h6");
        cell.text(key + ":" + value);
      });
      // BONUS: Build the Gauge Chart
      buildGauge(data.WFREQ);
    });  
}

function buildGauge(frequency){
  // frequency(9 values) between 0 and 180 multiply by 20 so that 9 values goes into 180
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

  var gauge_data = [
    { type: 'scatter',
      x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'frequency',
      text: level,
      hoverinfo: 'name'
    },
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9','7-8','6-7',
            '5-6', '4-5', '3-4',
              '2-3','1-2', '0-1'
            ],
      textinfo: 'text',
      textposition:'inside',
      marker: {
            colors:[ 'rgba(0, 51, 0, .5)','rgba(0, 76, 0, .5)',
                      'rgba(0, 102, 0, .5)','rgba(14, 127, 0, .5)',
                      'rgba(102, 127, 12, .5)', 'rgba(110, 154, 22, .5)',
                      'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                      'rgba(210, 206, 145, .5)', 'rgba(255, 255, 255, 0)'
                    ]
            },
      hole: .5,
      type: 'pie',
      showlegend: false
    }
  ];

  var gauge_layout = {
    shapes:[
      {
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }
    ],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
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
  
  //fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){

    //Build a Bubble Chart using the sample data
    var bubbleData = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker:{size: data.sample_values, color:data.otu_ids},
      text: data.otu_labels
    }];

    //layout for bubble
    var bubble_layout = {
      xaxis:{title: 'OTU ID', showline: false}, 
      yaxis:{title: 'Sample values', showline: false}
    };
    //display data in console
    console.log(bubbleData);

    Plotly.newPlot('bubble',bubbleData, bubble_layout);
    
    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    //combine data to be sorted
    const pie_map = [];
    for(var i = 0; i < data.sample_values.length;i++){
      pie_map.push([data.sample_values[i],data.otu_ids[i],data.otu_labels[i]]);
    }
    //sort based on sample_values which are located at 0th index of inner array
    const pie_sort = pie_map.sort((a,b) => {return b[0]-a[0]});
    
    const pieSortSliced = pie_sort.slice(0,10);
    //console.log(pieSortSliced);

    //separate sorted and sliced data into own arrays to use in pie chart
    const pie_ids = [];
    const pie_values = [];
    const pie_labels = [];
    pieSortSliced.forEach(d =>{
      pie_values.push(d[0]);
      pie_ids.push(d[1]);
      pie_labels.push(d[2]);
    });

    var pie_data =[{
              labels: pie_ids,
              values: pie_values,
              hovertext: pie_labels,
              type: 'pie'
    }];
    
    var layout = {
      height: 400,
      width: 500
    };
    //display data in console
    console.log(pie_data);
    
    Plotly.newPlot('pie',pie_data,layout);
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

