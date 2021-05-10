/* GLOBAL HELPER VARIABLE */
let lastTenGlobal = []

/* BUTTON FUNCTIONALITY FIRST */
let twitterSwitch = true

// twitter-feed-button
function trigger_twitter_button(){
    if (twitterSwitch) {
        twitterSwitch = false
    } else {
        twitterSwitch = true
    }
    // lastly, call show_hide_feed()
    show_hide_feed(twitterSwitch)
}

function show_hide_feed(switchValue) {
    if(switchValue){
        console.log('show feed')
        document.getElementById("mySidepanel").style.height = "49vh";

        // when showing feed, gey out top-words-rects
        d3.selectAll(".top-word-rect")
            .transition()
            .duration(500)
            .style('fill', 'rgba(53,151,143,0.3)')
            .style('stroke', 'rgba(1,102,94,0.3)')


    } else {
        document.getElementById("mySidepanel").style.height = "0px";
        d3.selectAll(".top-word-rect")
            .transition()
            .duration(500)
            .style('fill', '#35978f')
            .style('stroke', '#01665e')
    }
}



/* HTML GEN */
function build_feed_row(listOfMatchesAndPredictions){

    let helperArray = [];
    listOfMatchesAndPredictions.forEach((match, index) => {

        // create html string for each match
        let tmpHtmlRow = `<div class="row" style="height: 15%; border-bottom: thin solid black">
                                    <div class="col">
                                        <div class="row" style="height: 100%">
                                            <div class="col-4">
                                                <div class="row justify-content-center" style="height: 66%">
                                                    <img class="align-self-center" src="static/img/club-icons/${match['name_home_team']}.png" style="max-height:80%; width: auto; height: auto">
                                                </div>
                                                <div class="row justify-content-center" style="height: 34%">
                                                    <span class="align-self-center" style="font-size: 0.5em; text-align: center">
                                                        ${match['name_home_team']}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="row justify-content-center" style="height: 66%">
                                                    <span class="align-self-center" style="text-align: center; font-weight: 700;">
                                                        ${match['score_home']}:${match['score_away']}
                                                    </span>
                                                </div>
                                                <div class="row justify-content-center" style="height: 34%">
                                                    <img class="align-self-center info-png" src="static/img/info.png" onclick="display_feed_match(${index})">
                                                    
                                                    
<!--                                                    <span class="align-self-center" style="text-align: center; font-size: 0.6em" onclick="show_feed_match(${index})">explore</span>-->
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="row justify-content-center" style="height: 66%">
                                                    <img class="align-self-center" src="static/img/club-icons/${match['name_away_team']}.png" style="max-height:80%; width: auto; height: auto">
                                                </div>
                                                <div class="row justify-content-center" style="height: 34%">
                                                    <span class="align-self-center" style="font-size: 0.5em; text-align: center">
                                                        ${match['name_away_team']}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`

        // push html string to helperArray
        helperArray.push(tmpHtmlRow)
    })

    // reverse order of helper array
    let final_array = helperArray.reverse()

    // final html is simple concat
    let finalHtml = final_array.join("")

    // update
    document.getElementById("feed-parent").innerHTML = finalHtml;
}



// temp call -> replace with call to server route @ latest_gens
function serverListener() {

    setTimeout(function() {

        // make request
        request_latest_predictions()

        // listOfMatchesAndPredictions should already be the last ten matches -> server should just send last 10
        serverListener(); // recursion
    }, 2000)
}


function request_latest_predictions() {

    axios.get('/latest-predictions')
        .then( response => {

            console.log(response.data)
            // store last ten generated matches in global variable
            lastTenGlobal = response.data

            // build feed
            build_feed_row(response.data)
        })
        .catch(function (error) {
            console.log(error)
        });
}

// INIT - make initial request, then start to listen to the server
request_latest_predictions()
serverListener()