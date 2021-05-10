/*
    CAROUSEL BEHAVIOR
*/

// define carousel behaviour
let carouselExploreGenerate = $('#explore-and-generate-carousel');
let carousel = $('#outputCarousel');

// prevent rotating
carousel.carousel({
    interval: false
})

carouselExploreGenerate.carousel({
    interval: false
})

function explore() {

    // send current settings to server
    sendFilterSettings()

    // go to explore on both carousels
    carousel.carousel(0)
    carouselExploreGenerate.carousel(0)
    carousel.carousel('pause')
    carouselExploreGenerate.carousel('pause')

    // hide feed if it is currently not collapsed and would thus interfere with the exploration
    if (twitterSwitch){
        trigger_twitter_button()
    }

}

function generate() {
    carousel.carousel(1)
    carouselExploreGenerate.carousel(1)
    carousel.carousel('pause')
    carouselExploreGenerate.carousel('pause')
}
