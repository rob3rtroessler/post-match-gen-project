let stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
    "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they",
    "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those",
    "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does",
    "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of",
    "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after",
    "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further",
    "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more",
    "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
    "t", "can", "will", "just", "don", "should", "now"]

// stop word switch
function sw_switch_triggered(){
    //console.log(document.getElementById('sw-switch').checked)

    // fire topWordsVis' wrangleData method after the switch has been triggered
    topWordsVis.stopWordsSwitch = document.getElementById('sw-switch').checked

    if (topWordsVis.stopWordsSwitch){
        document.getElementById('sw-switch-label').innerHTML= 'stop words included'
    } else {
        document.getElementById('sw-switch-label').innerHTML= 'stop words dropped'
    }

    topWordsVis.wrangleData()
}

function show_token_difference() {
    topWordsVis.animateTokenFreqDiff()
}


// helper functions for explorer
function display_instructions() {
    let htmlString = `<div class="col">
                    <div class="row box" style="height: 29vh; border: thin solid grey; background: #ececec; padding: 5px; border-radius: 5px">
        
                        <div class="col-2 offset-1">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col" style="background: rgba(53,151,143,0.75); border: thin solid #01665e; border-radius: 5px;">
                                    <div class="row justify-content-center" style="height: 66%;">
                                        <img class="align-self-center" src="static/img/explore.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row justify-content-center" style="height: 34%">
                                        <span class="align-self-center structure-text" style="text-align: center;">explore data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col">
                                    <div class="row justify-content-center" style="height: 100%;">
                                        <img class="align-self-center" src="static/img/arrow-right.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col" style="background: rgba(223,194,125,0.75); border: thin solid #8c510a; border-radius: 5px;">
                                    <div class="row justify-content-center" style="height: 66%;">
                                        <img class="align-self-center" src="static/img/logo.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row justify-content-center" style="height: 34%">
                                        <span class="align-self-center structure-text" style="text-align: center;">generate interview</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col">
                                    <div class="row justify-content-center" style="height: 100%;">
                                        <img class="align-self-center" src="static/img/arrow-right.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="col-2">
                            <div class="row" style="height: 100%; padding: 2vw 2vw 2vw 2vw;">
                                <div class="col" style="background: rgba(94,177,191,0.75); border: thin solid rgb(54,106,115); border-radius: 5px;">
                                    <div class="row justify-content-center" style="height: 66%;">
                                        <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row justify-content-center" style="height: 34%">
                                        <span class="align-self-center structure-text" style="text-align: center;">examine interviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                    </div>
                </div>`

    document.getElementById('output-row').innerHTML = htmlString
}

function display_interviews(data) {

    let backgroundColor = '#c7eae5'

    // update text
    let interview_home = data['interview_home_english']
    let interview_away = data['interview_away_english']

    let htmlString = `<div class="col">
                            <div class="row box" style="height: 14vh; border: thin solid grey; margin-bottom: 1vh; background: ${backgroundColor}; padding: 5px; border-radius: 5px">
                                <div class="col-1">
                                    <div class="row justify-content-center" style="height: 75%">
                                        <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row">
                                        <span style="text-align: center; font-size: 0.7em">(home)</span>
                                    </div>
                                </div>
                                <div class="col-11">
                                    <div class="row" style="height: 100%">
                                        <div class="coach-output"><span id="interview_home">${interview_home}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row box" style="height: 14vh; border: thin solid grey; margin-bottom: 1vh; background: ${backgroundColor}; padding: 5px; border-radius: 5px">
                                <div class="col-1">
                                    <div class="row justify-content-center" style="height: 75%">
                                        <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                    </div>
                                    <div class="row">
                                        <span style="text-align: center; font-size: 0.7em">(away)</span>
                                    </div>
                                </div>
                                <div class="col-11">
                                    <div class="row" style="height: 100%">
                                        <div class="coach-output"><span id="interview_away">${interview_away}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>`

    // update
    document.getElementById('output-row').innerHTML = htmlString
}

// helper function for feed
function display_feed_match(index){

    let match_data = lastTenGlobal[index]

    console.log(match_data)
    // prepare the data to use to update
    let updateData = {
        stats: {
            score_home: match_data.score_home,
            score_away: match_data.score_away,
            shots_home:  match_data.shots_home,
            shots_away:  match_data.shots_away,
            passes_home: match_data.passes_home,
            passes_away: match_data.passes_away,
            misplaced_passes_home: match_data.misplaced_passes_home,
            misplaced_passes_away: match_data.misplaced_passes_away,
            pass_accuracy_home: match_data.pass_accuracy_home,
            pass_accuracy_away:  match_data.pass_accuracy_away,
            distance_home: match_data.distance_home,
            distance_away: match_data.distance_away
        },
        interviews: {generated_interview_home: match_data.interview_home_english, generated_interview_away: match_data.interview_away_english}
    }

    // call display predictions
    display_predictions(updateData)
}

// helper function for generator
function display_predictions(data){

    console.log(data)

    let backgroundColor = '#f6e8c3'
    // first go to 'generate' slide by imitating the 'generate' button click
    generate()

    // for each slider, update the handles using the provided stats
    generatorSliders.forEach( (slider, i) => {

        let current_filter = generatorSliderSettings[i]['filter_key']

        // update handle
        slider.noUiSlider.set(data.stats[current_filter])

        // update number labels
        document.getElementById(generatorSliderSettings[i]['span_id']).innerHTML = data.stats[current_filter].toFixed(0);
        });

    // generate new html string
    let html = `<div class="row box" style="height: 14vh; border: thin solid grey; margin-bottom: 1vh; background: ${backgroundColor}; padding: 5px; border-radius: 5px">
                    <div class="col-1">
                        <div class="row justify-content-center" style="height: 75%">
                            <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                        </div>
                        <div class="row">
                            <span style="text-align: center; font-size: 0.7em">(home)</span>
                        </div>
                    </div>
                    <div class="col-11">
                        <div class="row" style="height: 100%">
                            <div class="coach-output"><span id="interview_home">${data.interviews.generated_interview_home}</span></div>
                        </div>
                    </div>
                </div>
                <div class="row box" style="height: 14vh; border: thin solid grey; margin-bottom: 1vh; background: ${backgroundColor}; padding: 5px; border-radius: 5px">
                    <div class="col-1">
                        <div class="row justify-content-center" style="height: 75%">
                            <img class="align-self-center" src="static/img/coach_3.png" style="display: block; max-height:80%; width: auto; height: auto;">
                        </div>
                        <div class="row">
                            <span style="text-align: center; font-size: 0.7em">(away)</span>
                        </div>
                    </div>
                    <div class="col-11">
                        <div class="row" style="height: 100%">
                            <div class="coach-output"><span id="interview_away">${data.interviews.generated_interview_away}</span></div>
                        </div>
                    </div>
                </div>`

    // update html string
    document.getElementById('generator-output').innerHTML = html;

}

function reset_generator(){

    // reset slider handles
    generatorSliders.forEach( (slider, i) => {

        // update the handles
        slider.noUiSlider.set(generatorSliderSettings[i].start)

        // update numbers on the side
        document.getElementById(generatorSliderSettings[i]['span_id']).innerHTML = generatorSliderSettings[i].start;

    });

    // reset generatorFilterSettings
    generatorFilterSettings = {
        score_home: generatorSliderSettings[0].start,
        score_away: generatorSliderSettings[1].start,
        shots_home:  generatorSliderSettings[2].start,
        shots_away:  generatorSliderSettings[3].start,
        passes_home: generatorSliderSettings[4].start,
        passes_away: generatorSliderSettings[5].start,
        misplaced_passes_home: generatorSliderSettings[6].start,
        misplaced_passes_away: generatorSliderSettings[7].start,
        pass_accuracy_home:  generatorSliderSettings[8].start,
        pass_accuracy_away:  generatorSliderSettings[9].start,
        distance_home:  generatorSliderSettings[10].start,
        distance_away:  generatorSliderSettings[11].start
    }




    // reset html
    let html = `<div class="row box" style="height: 29vh; border: thin solid grey; background: #f6e8c3; padding: 5px; border-radius: 5px">
                    <div class="col-4 offset-1">
                        <div class="row" style="height: 25%"></div>
                        <div class="row" style="height: 50%; border-radius: 5px; border: thin solid grey; background: rgba(255,255,255,0.7)">
                            <div class="col-6">
                                <div class="row justify-content-center" style="height: 100%">
                                    <img class="align-self-center" src="static/img/slider.png" style="display: block; max-height:100%; width: auto; height: auto;">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="row justify-content-center" style="height: 100%">
                                    <span class="align-self-center structure-text" style="text-align: center;">
                                        Use the sliders and generate a custom interview
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="row justify-content-center" style="height: 100%">
                                    <span class="align-self-center structure-text" style="text-align: center;">
                                        or
                                    </span>
                        </div>
                    </div>

                    <div class="col-4">
                        <div class="row" style="height: 25%"></div>
                        <div class="row" style="height: 50%; border-radius: 5px; border: thin solid grey; background: rgba(255,255,255,0.7)">
                            <div class="col-6">
                                <div class="row justify-content-center" style="height: 100%">
                                    <img class="align-self-center" src="static/img/twitter-logo.png" style="display: block; max-height:80%; width: auto; height: auto;">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="row justify-content-center" style="height: 100%">
                                    <span class="align-self-center structure-text" style="text-align: center;">
                                        Pick from the most recent predictions that our twitter bot has generated
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>`

    document.getElementById('generator-output').innerHTML = html;
}

function pick_random_gen_values() {

}