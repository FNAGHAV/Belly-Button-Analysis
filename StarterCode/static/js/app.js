// Load the JSON data
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
    let names = data.names;
    let samples = data.samples;
    let metadata = data.metadata;

    // Initialize dropdown menu with sample IDs
    let dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Function to update the bar chart
    function updateBarChart(sampleID) {
        let sample = samples.find(s => s.id === sampleID);
        let sampleValues = sample.sample_values.slice(0, 10).reverse();
        let otuIds = sample.otu_ids.slice(0, 10).map(d => `OTU ${d}`).reverse();
        let otuLabels = sample.otu_labels.slice(0, 10).reverse();

        let trace = {
            x: sampleValues,
            y: otuIds,
            type: "bar",
            orientation: "h",
            text: otuLabels
        };

        let layout = {
            title: "Top 10 Operational Taxonomic Units (OTU)",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU ID" }
        };

        let data = [trace];

        Plotly.newPlot("bar", data, layout);
    }

    // Function to load and display bubble chart
    function buildBubbleChart(sampleData) {
        // Extracting required data
        let otuIds = sampleData.otu_ids;
        let sampleValues = sampleData.sample_values;
        let otuLabels = sampleData.otu_labels;

        // Create trace for bubble chart
        let trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Viridis"
            }
        };

        // Define data array
        let data = [trace];

        // Define layout
        let layout = {
            title: "Belly Button Biodiversity - Bubble Chart",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        // Plot the bubble chart
        Plotly.newPlot("bubble", data, layout);
    }

    // Function to update all charts based on selected ID
    function updateCharts(selectedID) {
        let sampleData = samples.find(sample => sample.id === selectedID);
        updateBarChart(selectedID);
        buildBubbleChart(sampleData);
        updateMetadata(selectedID);
    }

    // Function to update the demographic info displayed on the page
    function updateMetadata(selectedID) {
        let selectedEntry = metadata.find(entry => entry.id === parseInt(selectedID));
        let metadataPanel = d3.select("#sample-metadata");
        // Clear existing content
        metadataPanel.html("");
        // Append each key-value pair to the metadata panel
        Object.entries(selectedEntry).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    }

    // Function to load data and build charts
    function getDataAndBuildCharts() {
        let initialSample = "940";
        updateCharts(initialSample);
    }

    // Call the function to load data and build charts
    getDataAndBuildCharts();

    // Event listener for dropdown change
    dropdown.on("change", function() {
        let selectedID = this.value;
        updateCharts(selectedID);
    });
});