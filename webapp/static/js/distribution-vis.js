class DistributionVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.wrangledDate = []

        // call initVis method
        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 50, bottom: 50, left: 50};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        // vis.svg.append('g')
        //     .attr('class', 'title bar-title')
        //     .append('text')
        //     .text('Currently selected games from dataset')
        //     .attr('transform', `translate(${vis.width / 2}, -15)`)
        //     .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'distributionTooltip')

        // drop downs listeners
        vis.xAxisDropDown = d3.select("#x-axis-selection").on('change', () => {
            vis.updateVis()
        })

        vis.yAxisDropDown = d3.select("#y-axis-selection").on('change', () => {
            vis.updateVis()
        })

        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // text label for the y axis
        vis.yLabel = vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "0.7em")
            .text("Goal Difference");

        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height *1/10))
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.5em")
            .text("Home Team -->");

        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.margin.left)
            .attr("x",0 - (vis.height *9/10))
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.5em")
            .text("<-- Away Team");

        // text label for the x axis
        vis.xLabel = vis.svg.append("text")
            .attr("y", vis.height)
            .attr("x",vis.width / 2)
            .attr("dy", "3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.7em")
            .text("Difference in Shots");

        vis.svg.append("text")
            .attr("y", vis.height)
            .attr("x", vis.width *9/10)
            .attr("dy", "3.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.5em")
            .text("Away Team -->");

        vis.svg.append("text")
            .attr("y", vis.height)
            .attr("x", vis.width *1/10)
            .attr("dy", "3.3em")
            .style("text-anchor", "middle")
            .style("font-size", "0.5em")
            .text("<-- Home Team");
    }

    wrangleData(){
        let vis = this

        // reset wrangledDate
        vis.wrangledDate = []

        // calculate goal & shot diff & populate wrangledData
        vis.data.forEach(match => {

            let goals_diff = match['score_home'] - match['score_away']
            let shots_diff = match['shots_home'] - match['shots_away']
            let distance_diff = match['distance_home'] - match['distance_away']
            let accuracy_diff = match['pass_accuracy_home'] - match['pass_accuracy_away']

            vis.wrangledDate.push({
                goals_diff: goals_diff,
                shots_diff: shots_diff,
                distance_diff: distance_diff,
                accuracy_diff: accuracy_diff,
                data : match
            })
        })

        console.log(vis.wrangledDate);

        // after data wrangling is done, call updateVis method
        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // grab latest values
        let x_category = document.getElementById("x-axis-selection").value;
        let y_category = document.getElementById("y-axis-selection").value;

        let categoryLookUpTable = {
            goals_diff: 'Goals (difference, total)',
            shots_diff: 'Shots (difference, total)',
            distance_diff: 'Distance Covered (difference, km)',
            accuracy_diff: 'Pass Accuracy (difference, %)',
        }

        // update axis labels
        if (x_category !== 'x-axis'){
            vis.xLabel.text(categoryLookUpTable[x_category])
        }
        if (y_category !== 'y-axis'){
            vis.yLabel.text(categoryLookUpTable[y_category])
        }

        // scale for x axis
        vis.xScale = d3.scaleLinear()
            .range([vis.width, 0])
            .domain([d3.min(vis.wrangledDate, d => d[x_category]), d3.max(vis.wrangledDate, d => d[x_category])])


        // scale for y axis
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([d3.min(vis.wrangledDate, d => d[y_category]), d3.max(vis.wrangledDate, d => d[y_category])])

        // axis
        vis.xAxisGroup.transition().duration(500).call(d3.axisBottom(vis.xScale))
        vis.yAxisGroup.transition().duration(500).call(d3.axisLeft(vis.yScale))

        // draw scatter plot
        vis.circles = vis.svg.selectAll('circle').data(vis.wrangledDate)

        vis.circles.enter().append('circle')
            .merge(vis.circles)
            .attr('cx', d => vis.xScale(d[x_category])+ Math.floor(Math.random() * 5)) // some randomness to see overlapping matches
            .attr('cy', d => vis.yScale(d[y_category]))

            .on('mouseover', function (event,d) {

                // reset all
                d3.selectAll('.match_circle')
                    .attr('r', 2)
                    .style('fill', '#35978f')

                // highlight selection
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('r', 10)
                    .style('fill', '#35978f')

                // display interviews in output row
                display_interviews(d.data)

                // update tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("display", 'block')
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px; width: 20vw; height: 30vh">
                            <div class="container-fluid" style="height: 100%; width: 100%">
                                <div class="row" style="height: 15%">
                                    <div class="col-6">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <img class="align-self-center" src="static/img/club-icons/${d.data['name_home_team']}.png" style="max-height:80%; width: auto; height: auto">                                        
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <img class="align-self-center" src="static/img/club-icons/${d.data['name_away_team']}.png" style="max-height:80%; width: auto; height: auto">                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- team names -->
                                <div class="row" style="height: 15%; margin-bottom: 5%">
                                    <div class="col-6">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h3>${d.data['name_home_team']}<h3>                                        
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h3>${d.data['name_away_team']}<h3>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- goals -->
                                <div class="row" style="height: 12.5%">
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['score_home']}<h5>                                        
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h4>goals<h4>                                        
                                        </div>
                                    </div>
                                     <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['score_away']}<h5>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- shots -->
                                <div class="row" style="height: 12.5%">
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['shots_home']}<h5>                                        
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h4>score<h4>                                        
                                        </div>
                                    </div>
                                     <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['shots_away']}<h5>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- passes -->
                                <div class="row" style="height: 12.5%">
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['passes_home']}<h5>                                        
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h4 class="align-self-center">total passes<h4>                                        
                                        </div>
                                    </div>
                                     <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['passes_away']}<h5>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- misplaced passes -->
                                <div class="row" style="height: 12.5%">
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['misplaced_passes_home']}<h5>                                        
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h4 class="align-self-center">mispalced passes<h4>                                        
                                        </div>
                                    </div>
                                     <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['misplaced_passes_away']}<h5>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                 <!-- pass accuracy -->
                                <div class="row" style="height: 12.5%">
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['pass_accuracy_home']}%<h5>                                        
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h4 class="align-self-center">pass accuracy<h4>                                        
                                        </div>
                                    </div>
                                     <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['pass_accuracy_away']}%<h5>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- distance covered -->
                                <div class="row" style="height: 12.5%">
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['distance_home']}<h5>                                        
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h4 class="align-self-center">distance covered<h4>                                        
                                        </div>
                                    </div>
                                     <div class="col-4">
                                        <div class="row justify-content-center" style="height: 100%">
                                            <h5 class="align-self-center">${d.data['distance_away']}<h5>                                        
                                        </div>
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>`);
            })
            .on('mouseout', function (event,d) {

                // stop highlighting
                d3.select(this)
                    .attr('r', 2)
                    .style('fill', '#35978f')

                // <h3>${d.data['name_home_team']} - ${d.data['name_away_team']}<h3>
                // <h4>Score: ${d.data['score_home']} - ${d.data['score_away']}</h4>
                // <h4>Shots: ${d.data['shots_home']} - ${d.data['shots_away']}</h4>
                // <h4>Passes: ${d.data['passes_home']} - ${d.data['passes_away']}</h4>
                // <h4>Misplaced Passes: ${d.data['misplaced_passes_home']} - ${d.data['misplaced_passes_away']}</h4>
                // <h4>Pass Accuracy: ${d.data['pass_accuracy_home']}% - ${d.data['pass_accuracy_away']}%</h4>
                //
                // reset output row to instructions
                display_instructions()

                // hide tooltip
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0 +"px")
                    .style("top", 0+ "px")
                    .style("display", 'none')

            })
            .on('click', function (a,b) {
                console.log('test', a,b)
            })
            .attr('r', 0)
            .transition()
            .duration(500)
            .attr('class', 'match_circle')
            .attr('cx', d => vis.xScale(d[x_category])+ Math.floor(Math.random() * 5)) // some randomness to see overlapping matches
            .attr('cy', d => vis.yScale(d[y_category]))
            .attr('r', 2)
            .style('fill', '#35978f')
            .style('opacity', '0.4')
            .style('stroke', '#01665e')

        vis.circles.exit().remove()

    }
}