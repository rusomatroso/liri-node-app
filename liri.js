require("dotenv").config();
var search = process.argv[2];
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var omdbApi = require('omdb-client');
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var userName = "johnyK2318";
var divider = "\n------------------------------------------------------------------------------------";
function getTweets() {
    console.log(divider + '\nYOU ARE GOING TO SEE my TWEETS by @' + userName + divider);

    var params = {screen_name: userName, count: 20}; // getting 20 tweets about userName
    twitter.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            if (tweets.length > 0) {
                for (let i = 0; i < tweets.length; i++) {
                    console.log(divider + '\nTweet #' + (i + 1) + ' @ ' + tweets[i].created_at);
                    console.log(tweets[i].text + divider);
                }
            }
        }
    });
}

function runSpotify(querySong) {
    if (querySong.length < 1) {
        querySong = '"The Sign"';
    }
    spotify.search({type: 'track', query: 'track:' + querySong}, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(divider + '\nYOU LOOKED FOR ' + data.tracks.items[0].name + divider + '\nSong name: '
            + data.tracks.items[0].name + '\nPreview url: ' + data.tracks.items[0].preview_url + '\nArtist: '
            + data.tracks.items[0].artists[0].name + '\nAlbum: ' + data.tracks.items[0].album.name + divider);
    });
}

function processCommand(inputs) {
    var commandString = '';
    for (var i = 3; i < inputs.length; i++) {
        commandString = commandString + ' ' + inputs[i];
        console.log(inputs[i]);
    }
    return commandString.trim();
}

function getMovie(queryMovie) {
    var params = {
        apiKey: keys.omdb.key,
        title: 'Mr. Nobody'
    };
    if (queryMovie.length > 0) {
        params.title = queryMovie;
    }
    omdbApi.get(params, function (err, data) {
        console.log(divider + '\nYOU LOOKED FOR ' + data.Title + divider + '\nMovie: ' + data.Title + '\nYear: ' + data.Year);
        if (data.Ratings && data.Ratings.length > 0) {
            for (let rating of data.Ratings) {
                if (rating.Source === 'Rotten Tomatoes' || rating.Source === 'Internet Movie Database') {
                    console.log(rating.Source + ': ' + rating.Value);
                }
            }
        } else {
            console.log(divider + 'No rating for this movie' + divider);
        }
        console.log('Country: ' + data.Country + '\nLanguage: ' + data.Language + '\nPlot: ' + data.Plot + '\nActors: '
            + data.Actors + divider);
        // console.log(data);
    });
}

function logInput() {
    var newInput = process.argv.slice(2);
    fs.appendFile('./log.txt', ", " + newInput, function (err) {
        if (err) throw err;
    });
    };

if (process.argv[2] === 'my-tweets') {
    getTweets();
    logInput();
    }
if (process.argv[2] === 'spotify-this-song') {
    var track = processCommand(process.argv);
    runSpotify(track);
    logInput();
}
if (process.argv[2] === 'movie-this') {
    var movie = processCommand(process.argv);
    getMovie(movie);
    logInput();
}