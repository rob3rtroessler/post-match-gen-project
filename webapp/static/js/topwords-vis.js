class TopWordsVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.filteredData = []
        this.wrangledDate = []
        this.stopWordsSwitch = true

        // call initVis method
        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 30, bottom: 50, left: 10};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height()*5 - vis.margin.top - vis.margin.bottom;

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
        //     .text('most frequent words')
        //     .attr('transform', `translate(${vis.width / 2}, -15)`)
        //     .attr('text-anchor', 'middle');


        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'distributionTooltip')

        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // having initialized the map, move on to wrangle data
        // this.wrangleData();
    }

    wrangleData(){
        let vis = this

        // count tokens and token frequency
        let [tokens_home, tokens_away, number_of_tokens_home, number_of_tokens_away] = vis.countTokens(vis.data)

        // compute difference in frequency
        vis.freqDiffData = {
            home:vis.compute_token_freq_diff(tokens_home, tokens_away, number_of_tokens_home, number_of_tokens_away),
            away:vis.compute_token_freq_diff(tokens_away, tokens_home, number_of_tokens_away, number_of_tokens_home)
        }



        // sort
        let most_freq_home_sorted = vis.sortFrequency(tokens_home)
        let most_freq_away_sorted = vis.sortFrequency(tokens_away)

        // reset wrangledDate
        let home = most_freq_home_sorted.slice(0,100)
        let away = most_freq_away_sorted.slice(0,100)

        // prepare d3 data structure, i.e. array of dictionaries
        let homeFinal = [],
            awayFinal = []

        home.forEach(word=>{
            homeFinal.push({word: word[0], count: word[1]})
        })

        away.forEach(word=>{
            awayFinal.push({word: word[0], count: word[1]})
        })

        vis.wrangledDate = {home: homeFinal, away: awayFinal}

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // scale for rectWidth HOME & AWAY
        vis.rectWidthScaleHome = d3.scaleLinear()
            .range([vis.width*2/10, vis.width*4.5/10])
            .domain([d3.min(vis.wrangledDate.home, d => d.count), d3.max(vis.wrangledDate.home, d => d.count)])


        // home rects
        vis.rectanglesHome = vis.svg.selectAll('.home-rect').data(vis.wrangledDate.home)

        vis.rectanglesHome.enter().append('rect')
            .merge(vis.rectanglesHome)
            .attr('class', 'home-rect top-word-rect')
            .transition()
            .duration(500)
            .attr('x', (d,i) => 0)
            .attr('y', (d,i) => i*25)
            .attr('width', d => vis.rectWidthScaleHome(d.count))
            .attr('height', 20)
            .style('fill', d => {
                if (twitterSwitch) {
                    return 'rgba(53,151,143,0.3)'
                } else {
                    return 'rgba(53,151,143,1)'
                }
            })
            .style('stroke', d =>{
                if (twitterSwitch) {
                    return 'rgba(1,102,94,0.3)'
                } else {
                    return 'rgba(1,102,94,1)'
                }
            })

        vis.rectanglesHome.exit().remove()

        // away rects
        vis.rectanglesAway = vis.svg.selectAll('.away-rect').data(vis.wrangledDate.away)

        vis.rectanglesAway.enter().append('rect')
            .merge(vis.rectanglesAway)
            .attr('class', 'away-rect top-word-rect')
            .transition()
            .duration(500)
            .attr('x', (d,i) => vis.width - vis.rectWidthScaleHome(d.count)) // adjust for right side
            .attr('y', (d,i) => i*25)
            .attr('width', d => vis.rectWidthScaleHome(d.count))
            .attr('height', 20)
            .style('fill', d => {
                if (twitterSwitch) {
                    return 'rgba(53,151,143,0.3)'
                } else {
                    return 'rgba(53,151,143,1)'
                }
            })
            .style('stroke', d =>{
                if (twitterSwitch) {
                    return 'rgba(1,102,94,0.3)'
                } else {
                    return 'rgba(1,102,94,1)'
                }
            })

        vis.rectanglesAway.exit().remove()


        // home text
        vis.textHome = vis.svg.selectAll('.home-text').data(vis.wrangledDate.home)

        vis.textHome.enter().append('text')
            .merge(vis.textHome)
            .transition()
            .duration(500)
            .attr('class', 'home-text')
            .attr('x', (d,i) => 2)
            .attr('y', (d,i) => i*25+15)
            .text(d => `${d.word} (${d.count})`)

        vis.textHome.exit().remove()

        // home text
        vis.textAway = vis.svg.selectAll('.away-text').data(vis.wrangledDate.away)

        vis.textAway.enter().append('text')
            .merge(vis.textAway)
            .transition()
            .duration(500)
            .attr('class', 'away-text')
            .attr('x', (d,i) => vis.width-2) // adjust for right side
            .attr('y', (d,i) => i*25+15)
            .text(d => `${d.word} (${d.count})`)
            .style('text-anchor', 'end')

        vis.textAway.exit().remove()
    }

    // animations
    animateTokenFreqDiff(){
        let vis =this;


        // first, animate the current rectangles, so that they move to the middle
        d3.selectAll(".home-rect")
            .transition()
            .duration(400)
            .attr('x', (d,i) => vis.width/2 - 50)
            .attr('width', 100)
            // .transition()
            // .duration(400)
            // .attr('y', 0)
            // .attr('height', 0)

        d3.selectAll(".away-rect")
            .transition()
            .duration(400)
            .attr('x', (d,i) => vis.width/2 - 50)
            .attr('width', 100)
            // .transition()
            // .duration(400)
            // .attr('y', 0)
            // .attr('height', 0)

        // delete the text
        d3.selectAll(".home-text").remove();
        d3.selectAll(".away-text").remove();

        let duration = 500
        // with some delay, i.e. when all rects are centralized, update data binding
        function delayedVis() {
            setTimeout(function () {

                // we need a new scale
                let min = d3.min(vis.freqDiffData.home, d => d.relative_difference) < d3.min(vis.freqDiffData.away, d => d.relative_difference) ? d3.min(vis.freqDiffData.home, d => d.relative_difference) : d3.min(vis.freqDiffData.away, d => d.relative_difference)
                let max = d3.max(vis.freqDiffData.home, d => d.relative_difference) > d3.max(vis.freqDiffData.away, d => d.relative_difference) ? d3.max(vis.freqDiffData.home, d => d.relative_difference) : d3.max(vis.freqDiffData.away, d => d.relative_difference)

                let rectWidthScale = d3.scaleLinear()
                    .range([vis.width*2/10, vis.width*4.5/10])
                    .domain([min, max])

                // update home rects
                vis.diffRectsHome = vis.svg.selectAll('.home-rect').data(vis.freqDiffData.home)

                vis.diffRectsHome.enter().append('rect')
                    .merge(vis.diffRectsHome)
                    .attr('class', 'home-rect')
                    .transition()
                    .duration(duration)
                    .attr('x', (d,i) => 0)
                    .attr('y', (d,i) => i*25)
                    .attr('width', d => rectWidthScale(d.relative_difference))
                    .attr('height', 20)
                    .style('fill', d => {
                        if (twitterSwitch) {
                            return 'red'
                        } else {
                            return 'rgba(53,151,143,1)'
                        }
                    })
                    .style('stroke', d =>{
                        if (twitterSwitch) {
                            return 'rgba(1,102,94,0.3)'
                        } else {
                            return 'rgba(1,102,94,1)'
                        }
                    })

                vis.diffRectsHome.exit().remove()

                // home text
                vis.diffTextHome = vis.svg.selectAll('.home-text').data(vis.freqDiffData.home)

                vis.diffTextHome.enter().append('text')
                    .merge(vis.diffTextHome)
                    .attr('x', (d,i) => vis.width/2-50)
                    .attr('y', (d,i) => i*25+15)
                    .style('opacity', '0.1')
                    .transition()
                    .duration(duration)
                    .attr('class', 'home-text')
                    .attr('x', (d,i) => 2)
                    .attr('y', (d,i) => i*25+15)
                    .text(d => `${d.token} (${(d.relative_difference*100).toFixed(4)}%)`)
                    .style('opacity', '1')

                vis.diffTextHome.exit().remove()


                // update away rects
                vis.diffRectsAway = vis.svg.selectAll('.away-rect').data(vis.freqDiffData.away)

                vis.diffRectsAway.enter().append('rect')
                    .merge(vis.diffRectsAway)
                    .attr('class', 'away-rect')
                    .transition()
                    .duration(duration)
                    .attr('x', (d,i) => vis.width - rectWidthScale(d.relative_difference))
                    .attr('y', (d,i) => i*25)
                    .attr('width', d => rectWidthScale(d.relative_difference))
                    .attr('height', 20)
                    .style('fill', d => {
                        if (twitterSwitch) {
                            return 'red'
                        } else {
                            return 'rgba(53,151,143,1)'
                        }
                    })
                    .style('stroke', d =>{
                        if (twitterSwitch) {
                            return 'rgba(1,102,94,0.3)'
                        } else {
                            return 'rgba(1,102,94,1)'
                        }
                    })

                vis.diffRectsAway.exit().remove()

                // home text
                vis.diffTextAway = vis.svg.selectAll('.home-text').data(vis.freqDiffData.away)

                vis.diffTextAway.enter().append('text')
                    .merge(vis.textAway)
                    .attr('x', (d,i) => vis.width/2-50)
                    .attr('y', (d,i) => i*25+15)
                    .style('opacity', '0.1')
                    .transition()
                    .duration(duration)
                    .style('opacity', '1')
                    .attr('class', 'away-text')
                    .attr('x', (d,i) => vis.width-2) // adjust for right side
                    .attr('y', (d,i) => i*25+15)
                    .text(d => `${d.token} (${(d.relative_difference*100).toFixed(4)}%)`)
                    .style('text-anchor', 'end')



                vis.diffTextAway.exit().remove()


            }, 800);
        }
        delayedVis()
    }

    // helper methods
    countTokens() {
        let vis = this

        let tokens_home = {}
        let tokens_away = {}

        let col_home = ''
        let col_away = ''

        if(vis.stopWordsSwitch){
            col_home = 'interview_home_english_as_tokens';
            col_away = 'interview_away_english_as_tokens';
        } else {
            col_home = 'interview_home_english_as_tokens_no_stopwords';
            col_away = 'interview_away_english_as_tokens_no_stopwords';
        }

        let number_of_tokens_home = 0
        let number_of_tokens_away = 0

        vis.data.forEach( (match, index) => {

            // home team
            match[col_home].forEach(token =>{
                if (token in tokens_home){
                    tokens_home[token] +=1
                }
                else{
                    tokens_home[token] = 1
                }
                number_of_tokens_home += 1
            })

            // away team
            match[col_away].forEach(token =>{
                if (token in tokens_away){
                    tokens_away[token] +=1
                }
                else{
                    tokens_away[token] = 1
                }
                number_of_tokens_away += 1
            })
        })

        return [tokens_home, tokens_away, number_of_tokens_home, number_of_tokens_away]

        // // sort
        // let most_freq_home_sorted = vis.sortFrequency(most_freq_home)
        // let most_freq_away_sorted = vis.sortFrequency(most_freq_away)
        //
        // // return
        // return {home: most_freq_home_sorted, away: most_freq_away_sorted}
    }

    sortFrequency(freqDict){
        let vis = this;

        let items = Object.keys(freqDict).map(function(key) {
            return [key, freqDict[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        return items
    }

    compute_token_freq_diff(target_dict, complementary_dict, target_total_count, complementary_total_count) {
        let vis = this;

        let tokens = []
        let absolute_difference = []
        let relative_difference = []
        let unique_words = []

        for (const [key, value] of Object.entries(target_dict)) {

            // check if key is in the other dict
            if (complementary_dict.hasOwnProperty(key)) {
                tokens.push(key);
                absolute_difference.push(value);
                relative_difference.push(value/target_total_count - complementary_dict[key]/complementary_total_count)
            }
        }

        // create final data structure:
        let final_data_structure = []
        tokens.forEach( (token, index) => {
            final_data_structure.push({
                token: token,
                absolute_difference: absolute_difference[index],
                relative_difference: relative_difference[index]
            })
        })

        // now sort, and return only top 100
        // Sort the array based on the second element
        final_data_structure.sort(function(first, second) {
            return second['relative_difference'] - first['relative_difference'];
        });

        // return top 100 relative frequent words
        console.log(final_data_structure.slice(0,100))
        return final_data_structure.slice(0,100)
    }


}