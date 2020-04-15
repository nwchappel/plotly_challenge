function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;

      // Filter data for object with desired sample number
      var resultsArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultsArray[0];

      // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");
  
      // Use .html("") to clear any existing metadata
      panel.html("");
  
      // Use Object.entries to add each key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
      // Build the Gauge Chart
      buildGauge(result.wfreq);
    });
  }
  
  function buildChart(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultsArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultsArray[0];
  
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  function init() {
    // Reference the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use list of sample names to populate select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use first sample from list to build initial plots
      var firstSample = sampleNames[0];
      buildChart(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time new sample is selected
    buildChart(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize dashboard
  init();
  