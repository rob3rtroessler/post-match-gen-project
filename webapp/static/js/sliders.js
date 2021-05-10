let exploreSliders = []
let generatorSliders = []

// function to create sliders
function createExploreSliders(id, start, step, range, span_id, filter_key){

    let exploreSlider = document.getElementById(id);

    noUiSlider.create(exploreSlider, {
        start: start,
        step: step,
        behavior: 'drag-drop',
        connect: true,
        range: range,
        format: wNumb({
            decimals: 1
        })
    })

    // event listener
    exploreSlider.noUiSlider.on('slide', function () {

        // get value & update info + filterSettings
        let value = exploreSlider.noUiSlider.get();
        document.getElementById(span_id).innerHTML = `${+value[0]} - ${+value[1]}`
        explorerFilterSettings[filter_key] = [+value[0], +value[1]]

        // try dynamic updates
        sendFilterSettings()
    });

    // lastly, store slider
    exploreSliders.push(exploreSlider)
}

function createGeneratorSliders(id, start, step, range, span_id, filter_key){
    let generatorSlider = document.getElementById(id);

    noUiSlider.create(generatorSlider, {
        start: start,
        step: step,
        behavior: 'drag-drop',
        connect: true,
        range: range,
        format: wNumb({
            decimals: 1
        })
    })

    // event listener
    generatorSlider.noUiSlider.on('slide', function () {

        // get value & update info + filterSettings
        let value = generatorSlider.noUiSlider.get();
        document.getElementById(span_id).innerHTML = `${+value}`
        generatorFilterSettings[filter_key] = +value
    });



    generatorSliders.push(generatorSlider)

}

// SLIDER SETTINGS FOR EXPLORER SLIDERS
let explorerSliderSettings = [
    {id:'home-goals-slider', start: [0, 10], step: 1, range: {'min': 0,'max': 10}, span_id: "home-goals-span", filter_key: 'score_home'},
    {id:'away-goals-slider', start: [0, 10], step: 1, range: {'min': 0,'max': 10}, span_id: "away-goals-span", filter_key: 'score_away'},
    {id:'home-shots-slider', start: [0, 40], step: 1, range: {'min': 0,'max': 40}, span_id: "home-shots-span", filter_key: 'shots_home'},
    {id:'away-shots-slider', start: [0, 40], step: 1, range: {'min': 0,'max': 40}, span_id: "away-shots-span", filter_key: 'shots_away'},
    {id:'home-passes-slider', start: [0, 1000], step: 50, range: {'min': 0,'max': 1000}, span_id: "home-passes-span", filter_key: 'passes_home'},
    {id:'away-passes-slider', start: [0, 1000], step: 50, range: {'min': 0,'max': 1000}, span_id: "away-passes-span", filter_key: 'passes_away'},
    {id:'home-misplaced_passes-slider', start: [0, 200], step: 10, range: {'min': 0,'max': 200}, span_id: "home-misplaced-passes-span", filter_key: 'misplaced_passes_home'},
    {id:'away-misplaced_passes-slider', start: [0, 200], step: 10, range: {'min': 0,'max': 200}, span_id: "away-misplaced-passes-span", filter_key: 'misplaced_passes_away'},
    {id:'home-pass-acc-slider', start: [0, 100], step: 1, range: {'min': 0,'max': 100}, span_id: "home-pass-acc-span", filter_key: 'pass_accuracy_home'},
    {id:'away-pass-acc-slider', start: [0, 100], step: 1, range: {'min': 0,'max': 100}, span_id: "away-pass-acc-span", filter_key: 'pass_accuracy_away'},
    {id:'home-distance-slider', start: [90, 130], step: 1, range: {'min': 90,'max': 130}, span_id: "home-distance-span", filter_key: 'distance_home'},
    {id:'away-distance-slider', start: [90, 130], step: 1, range: {'min': 90,'max': 130}, span_id: "away-distance-span", filter_key: 'distance_away'}
]

// SLIDER SETTINGS FOR EXPLORER SLIDERS
let generatorSliderSettings = [
    {id:'home-goals-gen-slider', start: 5, step: 1, range: {'min': 0,'max': 10}, span_id: "home-goals-gen-span", filter_key: 'score_home'},
    {id:'away-goals-gen-slider', start: 5, step: 1, range: {'min': 0,'max': 10}, span_id: "away-goals-gen-span", filter_key: 'score_away'},
    {id:'home-shots-gen-slider', start: 20, step: 1, range: {'min': 0,'max': 40}, span_id: "home-shots-gen-span", filter_key: 'shots_home'},
    {id:'away-shots-gen-slider', start: 20, step: 1, range: {'min': 0,'max': 40}, span_id: "away-shots-gen-span", filter_key: 'shots_away'},
    {id:'home-passes-gen-slider', start: 500, step: 1, range: {'min': 0,'max': 1000}, span_id: "home-passes-gen-span", filter_key: 'passes_home'},
    {id:'away-passes-gen-slider', start: 500, step: 1, range: {'min': 0,'max': 1000}, span_id: "away-passes-gen-span", filter_key: 'passes_away'},
    {id:'home-misplaced_passes-gen-slider', start: 100, step: 1, range: {'min': 0,'max': 200}, span_id: "home-misplaced-passes-gen-span", filter_key: 'misplaced_passes_home'},
    {id:'away-misplaced_passes-gen-slider', start: 100, step: 1, range: {'min': 0,'max': 200}, span_id: "away-misplaced-passes-gen-span", filter_key: 'misplaced_passes_away'},
    {id:'home-pass-acc-gen-slider', start: 50, step: 1, range: {'min': 0,'max': 100}, span_id: "home-pass-acc-gen-span", filter_key: 'pass_accuracy_home'},
    {id:'away-pass-acc-gen-slider', start: 50, step: 1, range: {'min': 0,'max': 100}, span_id: "away-pass-acc-gen-span", filter_key: 'pass_accuracy_away'},
    {id:'home-distance-gen-slider', start: 110, step: 1, range: {'min': 90,'max': 130}, span_id: "home-distance-gen-span", filter_key: 'distance_home'},
    {id:'away-distance-gen-slider', start: 110, step: 1, range: {'min': 90,'max': 130}, span_id: "away-distance-gen-span", filter_key: 'distance_away'}
]


// init explorer sliders
explorerSliderSettings.forEach(slider =>{
    createExploreSliders(slider.id, slider.start, slider.step, slider.range, slider.span_id, slider.filter_key)
})

// init generator sliders
generatorSliderSettings.forEach(slider =>{
    createGeneratorSliders(slider.id, slider.start, slider.step, slider.range, slider.span_id, slider.filter_key)
})

// SLIDER SETTINGS FOR EXPLORER SLIDERS
let sentimentSlider = document.getElementById("sentiment-slider");

noUiSlider.create(sentimentSlider, {
    start: 0,
    step: 0.1,
    behavior: 'drag-drop',
    connect: true,
    range: {'min': -1,'max': 1},
    format: wNumb({
        decimals: 1
    })
})

sentimentSlider.setAttribute('disabled', true);