



function generate_prediction(){
    send_match_stats_to_server()
}

function send_match_stats_to_server() {

    console.log("--------------------------------------------\n " +
                "----------- generating interview -----------\n " +
                "--------------------------------------------\n " +
                "The following stats will be sent to the server:", grabGeneratorFilterSettings());


    axios.post('/get-prediction', {
        'stats' : grabGeneratorFilterSettings()
    })
        .then(function (response) {

            console.log("Server: The model has generated the following interview:\n", response);    // log the response from server to examine data

            // show the responses as well as the stats
            display_predictions(response.data)


        })
        .catch(function (error) {
            console.log(error)
        });
}
