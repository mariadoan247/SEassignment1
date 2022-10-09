var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require('fs');


//global variable for tweet data
var tweetinfo = [];
//global variable for searched tweets
var searchedTweets = [];

//load the input file
fs.readFile('favs.json', 'utf8', function readFileCallback(err,data ){
  if(err){
    req.log.info('cannot load a file:' + fileFolder + '/' + _file_name)
    throw err;
  }
  else{
    //TODO: store loaded data into a global variable for tweet data
	tweetinfo = JSON.parse(data);
  }
});
 


//Get functions
//Shows user info
app.get('/tweets', function(req, res) {
  //TODO: send all users' IDs
  res.send({ tweetinfo: tweetinfo });
});

//Shows tweet info
app.get('/tweetinfo', function(req, res) {
  //TODO: send tweet info
  res.send({ tweetinfo: tweetinfo });
});

//Shows searched tweets
app.get('/searchinfo', function(req, res){
  //TODO: send searched tweets
  res.send({ searchedTweets: searchedTweets });
});

//Post functions
//Posts created tweets
app.post('/tweetinfo', function(req, res) {
  //TODO: create a tweet.
  // Split string by semicolon to get id and text
  var tweet = req.body.tweet.split(';');
  var tweetID = tweet[0];
  var tweetText = tweet[1];
  // Get current date the tweet was made
  var currentDate = new Date();
  var createdAt = currentDate.toString('YYY-MM-dd');
  
  // This will add the tweet to the top of the array
  tweetinfo.unshift({
	  id: Number(tweetID), // Cast as number
	  id_str: tweetID,
	  text: tweetText,
	  created_at: currentDate,
	  // Also hold information about user to prevent get user error
	  user: {
		id: Number(tweetID),
		id_str: tweetID,
		name: 'tweeter' + tweetID,
		screen_name: 'tweeter' + tweetID
	  }
  });
  
  res.send('Successfully created tweet!')
});

//Posts searched tweets
app.post('/searchinfo', function(req, res) {
  //TODO: search a tweet
  var tweetID = req.body.tweetID;
  
  var found = false;
  
  // Condition for only if the searched tweet is not already present in the
  // the searchedTweets array
  if (!searchedTweets.some(e => e.id_str === tweetID)){
	  // Finds the searched tweet
	  tweetinfo.forEach(function(tweet, index) {
		  if (!found && tweet.id_str === tweetID) {
			  // Inserts tweet into the top of searchedTweets array
			  searchedTweets.unshift({
				  id: Number(tweetID),
				  id_str: tweetID,
				  text: tweet.text,
				  created_at: tweet.created_at
			  });
		  }
	  });
  }
  
  // Only will hold the 5 most recently searched
  if (searchedTweets.length > 5) {
	  searchedTweets.splice(-1);
  }
  
  res.send('Successfully searched tweet!');
});

//Update
app.put('/tweets/:nm', function(req, res) {
  //TODO: update tweets
  var userName = req.params.nm;
  var newScreenName = req.body.newScreenName;
  
  var found = false;
  
  // Finds the user with the given name
  tweetinfo.forEach(function(tweet, index) {
	  if (!found && tweet.user.name === userName) {
		  // assigns new screen name
		  tweet.user.screen_name = newScreenName;
	  }
  });
  
  res.send('Successfully updated screen name!');
});

//Delete 
app.delete('/tweetinfo/:tweetid', function(req, res) {
  //TODO: delete a tweet
  var id = req.params.tweetid;
  
  var found = false;
  
  // Finds the tweet that needs to be deleted based on id
  tweetinfo.forEach(function(tweet, index) {
	  if (!found && tweet.id_str === id) {
		  // deletes that tweet
		  tweetinfo.splice(index, 1);
	  }
  });
  
  res.send('Successfully deleted tweet!');
});


app.listen(PORT, function() {
  console.log('Server listening on ' + PORT);
});