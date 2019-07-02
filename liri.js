require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var search=process.argv[2];
var term=process.argv[3];


for (var i = 3 ; i < process.argv.length; i++){
    if (i>process.argv && i>3){
        term += " " + process.argv[i];
    }
    else{
        term += process.argv[i];
    }
    console.log(term);
}
    //search cases
    switch(search){
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis()
            break;
        case "movie-this":
            movies();
            break;
        case "do-what-it-says":
            doThis();
            break;
        default:
            console.log("Enter a valid search")
            break;
    }
    //search for concert
    function concertThis(){
        if(!term){
            term=" ";       
    }
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp")
    .then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
            console.log("Name: "+ response.data[i].venue.name);
            console.log("Location: "+ response.data[i].venue.city + "," + response.data[i].venue.country);
            console.log("Date: "+ moment(response.data[i].datetime).format("L"));
        }
    });
}
    //search for songs on Spotify
    if(!term){
        term = "I Want it That Way";
    }
   spotify.search({ 
       type: 'track', query: term 
    }, 
    function(err, data){
       if (err){
           return console.log('Error: ' + err);
       }
       var userData = data.tracks.items[0];
           console.log("Artist: " + userData.artists[0].name);
           console.log("Song: " + userData.name);
           console.log("Link: " + userData.preview_url);
           console.log("Album: " + userData.album.name);
    });
//};
    //search for movie
    function movies(){
        if (!term) {
            term = "Mr. Nobody";
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
     
        axios.get("http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
     
            console.log("Title: " + response.data.Title);
            console.log("Year Released: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating" + response.data.tomatoRating);
            console.log("Country " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        });
     };
     
     //This function executes the spotifyThis function
     function doThis () {
        fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
                console.log(err);
            }
     
            var textArray = data.split(",");
            term = textArray[1];
            spotifyThis(term);
        })
     };
   
    
