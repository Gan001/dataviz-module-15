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
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){

    // @TODO: Build a Bubble Chart using the sample data
    //d3.select('#pie').html('');
    var pieChart = d3.select("#pie");
    var bubbleChart = d3.select('#bubble');
    
    // var bubbleData = data;
    // bubbleData['mode'] = 'markers';
    //data.forEach(d=>console.log(d));
    //var bubbleLayout ={};
    //bubbleChart.append(Plotly.plot('bubble',data));
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    //var pie_slice = [data]
    var pie_data =[{labels: data.otu_labels.slice(0,10),
                    values: data.sample_values.slice(0,10),
                    type: 'pie'}]
    // pie_slice.slice(0,11).forEach(d=>{
    //   pie_data = [{
    //     labels: d.otu_labels,
    //     values: d.sample_values
    //   }];
    //   pieChart.append(Plotly.plot('pie', pie_data));
    // });
    var layout = {
      title: "Pie Chart",
      height: 400,
      width: 500}

    console.log(pie_data);
    pieChart.append(Plotly.plot('pie',pie_data,layout));
    
    // otu_ids, and labels (10 each).
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

