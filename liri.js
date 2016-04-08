var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var random;
var action = process.argv[2];
var media = process.argv[3];
var client = new Twitter(keys.twitterKeys);
switch(action)
{
	case 'my-tweets':
		displayTweets();
		break;
	case 'spotify-this-song':
		spotifyThis(media);
		break;
	case 'movie-this':
		if(!media)
		{
			media = 'Mr. Nobody';
		}
		omdb(media);
		break;
	case 'do-what-it-says':
		fs.readFile('random.txt', 'utf8', function(err, data){
			var args = data.split(',');
			if(args[0] == 'my-tweets')
			{
				displayTweets();
			}
			else if(args[0] == 'spotify-this-song')
			{
				spotifyThis(args[1]);
			}
			else if(args[0] == 'movie-this')
			{
				omdb(args[1]);
			}
		});
		break;
}
function displayTweets()
{
	var params = {screen_name: 'chrisspanos2'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
  	if (!error) {
    	console.log(tweets + " worked ");
  	}
  	console.log(error);
	});
}
function spotifyThis(song)
{
	spotify.search({ type: 'track', query: song }, function(err, data) {
  	if ( err ) {
    	console.log('Error occurred: ' + err);
    	return;
  	}
  	for(var i = 0; i < 20; i++)
  	{
  		console.log(i);
  		console.log("atrist(s): " + data.tracks.items[i].artists.name);
 			console.log("song name: " + data.tracks.items[i].name);
 			console.log("preview song: " + data.tracks.items[i].preview_url);
 			console.log("album: " + data.tracks.items[i].album.name);
 			console.log("---------------------------");
    }
	});
}
function omdb(movie)
{
	request('http://www.omdbapi.com/?tomatoes=true&t=' + movie, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
  		var movieInfo = JSON.parse(body.replace(/[\[\]']+/g,''));
    	console.log(movieInfo.Title);
    	console.log("Year : " + movieInfo.Year);
    	console.log("IMDB rating: " + movieInfo.imdbRating);
    	console.log("Rotten Tomatoes Rating: " + movieInfo.tomatoRating);
    	console.log("Country: " + movieInfo.Country);
    	console.log("Language: " + movieInfo.Language);
    	console.log("-------------------------------------------");
    	console.log(movieInfo.Plot);
    	console.log("-------------------------------------------");
    	console.log("Actors: " + movieInfo.Actors);
    	console.log(movieInfo.tomatoURL);
  	}
})
}