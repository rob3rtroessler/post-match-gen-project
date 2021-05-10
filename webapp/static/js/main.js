// DECLARE GLOBAL VARIABLES AND CREATE CLASS INSTANCES
let data = 'placeholder';
let distributionVis = new DistributionVis('distributionVisContainer', data)
let topWordsVis = new TopWordsVis('topWordsVisContainer', data)

let generatorFilterSettings;

// initial filter settings
let explorerFilterSettings = {
    score_home: explorerSliderSettings[0].start,
    score_away: explorerSliderSettings[1].start,
    shots_home:  explorerSliderSettings[2].start,
    shots_away:  explorerSliderSettings[3].start,
    passes_home: explorerSliderSettings[4].start,
    passes_away: explorerSliderSettings[5].start,
    misplaced_passes_home: explorerSliderSettings[6].start,
    misplaced_passes_away: explorerSliderSettings[7].start,
    pass_accuracy_home:  explorerSliderSettings[8].start,
    pass_accuracy_away:  explorerSliderSettings[9].start,
    distance_home:  explorerSliderSettings[10].start,
    distance_away:  explorerSliderSettings[11].start
}

function grabGeneratorFilterSettings() {

    // grab the values of wherever the slider is at the moment
    generatorFilterSettings = {
        score_home: +document.getElementById('home-goals-gen-slider').noUiSlider.get(),
        score_away: +document.getElementById('away-goals-gen-slider').noUiSlider.get(),
        shots_home: +document.getElementById('home-shots-gen-slider').noUiSlider.get(),
        shots_away: +document.getElementById('away-shots-gen-slider').noUiSlider.get(),
        passes_home: +document.getElementById('home-passes-gen-slider').noUiSlider.get(),
        passes_away: +document.getElementById('away-passes-gen-slider').noUiSlider.get(),
        misplaced_passes_home: +document.getElementById('home-misplaced_passes-gen-slider').noUiSlider.get(),
        misplaced_passes_away: +document.getElementById('away-misplaced_passes-gen-slider').noUiSlider.get(),
        pass_accuracy_home: +document.getElementById('home-pass-acc-gen-slider').noUiSlider.get(),
        pass_accuracy_away: +document.getElementById('away-pass-acc-gen-slider').noUiSlider.get(),
        distance_home: +document.getElementById('home-distance-gen-slider').noUiSlider.get(),
        distance_away: +document.getElementById('away-distance-gen-slider').noUiSlider.get()
    }

    return generatorFilterSettings;
}

function sendFilterSettings() {

    console.log("---------------------------------------------- \n " +
        "The following filter settings will be sent to the server:", explorerFilterSettings);


    axios.post('/filterData', {
        'filters' : explorerFilterSettings
    })
        .then(function (response) {

            console.log("The server sent back the following matches:", response);    // log the response from server to examine data

            // update data for distributionVis & call wrangleData method
            distributionVis.data = response.data
            distributionVis.wrangleData()

            // compute most frequent words & call
            console.log('cling toWordsVis')
            topWordsVis.data = response.data//computeMostFrequent(response.data)
            topWordsVis.wrangleData()
        })
        .catch(function (error) {
            console.log(error)
        });
}

// start by sending initial filter settings to the server
sendFilterSettings()