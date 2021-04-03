// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
    .append("svg")
    .style("background-color", "#bdc3c7")
    .style("opacity", 0.9)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("assets/data/data.csv").then(function (data) {

    console.log(data);

    // Cast the poverty and healthcare datum to a number for each piece of data
    data.forEach(function (data) {
        data['poverty'] = +data['poverty'];
        data['healthcare'] = +data['healthcare'];
    });


    // Add X axis
    var x = d3.scaleLinear()
        .domain([8, 23])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([2, 26])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("Poverty Rate (%)")
        .style("fill", "black");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top)
        .text("Lack of Healthcare (%)")
        .style("fill", "black");

    var tooltip = d3.select("#scatter")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        tooltip
            .html("State: " + d['state'] + '<br>' + "Lack of Healthcare: " + d['healthcare'] + '%' + '<br>' + "Poverty Rate: " + d['poverty'] + '%')
            .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d['poverty']); })
        .attr("cy", function (d) { return y(d['healthcare']); })
        .attr("r", 12)
        .style("fill", "#9b59b6")
        .style("opacity", 0.75)
        .style("stroke", "white")
        .style("stroke-width", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    svg.append('g')
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(d => d['abbr'])
        .attr("x", (d) => x(d['poverty']))
        .attr("y", (d) => y(d['healthcare']))
        .attr('font-size', '12px')
        .style('font', 'bold Verdana, Helvetica, Arial, sans-serif')
        .attr('text-anchor', 'middle')
        .style('fill', 'white');


});
