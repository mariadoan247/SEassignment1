// Using id_str to get show the exact value because of the roundoff error

// New addition for assignment 2 task 9
function test_print(){
	console.log("test code")
};

$(function() {
   //Get 
   $('#get-button').on('click', function() {
        //TODO: get all users' IDs & display it
		$.ajax({
			method: 'GET',
			url: '/tweets',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEl = $('#namebody');
				
				tbodyEl.html('');
				
				// Display necessary all the users
				response.tweetinfo.forEach(function(tweet) {
					tbodyEl.append('\
						<tr>\
							<td class="text">' + tweet.user.id_str + '</td>\
							<td class="name">' + tweet.user.screen_name + '</td>\
							<td class="name">' + tweet.user.name + '</td>\
						</tr>\
					');
				});
			}
		});
    });


    //Get tweets
    $('#get-tweets-button').on('click', function(){
        //TODO: get tweet info and display it
		$.ajax({
			method: 'GET',
			url: '/tweetinfo',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEl = $('#tweetbody');
				
				tbodyEl.html('');
				
				// Display all the tweets
				response.tweetinfo.forEach(function(tweet) {
					tbodyEl.append('\
						<tr>\
							<td class="text">' + tweet.id_str + '</td>\
							<td class="text">' + tweet.text + '</td>\
							<td class="text">' + tweet.created_at + '</td>\
						</tr>\
					');
				});
			}
		});
    });

    //Get searched tweets
    $('#get-searched-tweets').on('click', function() {
        //TODO: get a searched tweet(s) & display it
		$.ajax({
			method: 'GET',
			url: '/searchinfo',
			contentType: 'application/json',
			success: function(response) {
				var tbodyEl = $('#searchbody');
				
				tbodyEl.html('');
				
				// Only display recent tweets if length of searchedTweets is not 0
				if (response.searchedTweets.length != 0) {
					response.searchedTweets.forEach(function(tweet) {
						tbodyEl.append('\
							<tr>\
								<td class="text">' + tweet.id_str + '</td>\
								<td class="text">' + tweet.text + '</td>\
								<td class="text">' + tweet.created_at + '</td>\
							</tr>\
						');
					});
				}
				// If 0 tell user that there are no recently searched tweets
				else {
					tbodyEl.append('\
						<tr>\
							<td>' + 'No' + '</td>\
							<td>' + 'recently' + '</td>\
							<td>' + 'searched' + '</td>\
						</tr>\
					');
				}
			}
		});
    });


  //POST/CREATE
  $('#create-form').on('submit', function(event){
        event.preventDefault();

        var createInput = $('#create-input');

        //TODO: creat a tweet
		$.ajax({
            method: 'POST',
            url: '/tweetinfo',
            contentType: 'application/json',
			// tweet will be split in express.js
            data: JSON.stringify({ tweet: createInput.val() }),
            success: function(response) {
                console.log(response);
                createInput.val('');
                $('#get-tweets-button').click();
				// display updated table of tweets
            }
        });
  });

    //Create/Post searched tweets
  $('#search-form').on('submit', function(event){
		event.preventDefault();
		var tweetID = $('#search-input');
		
		//TODO: search a tweet and display it.
		$.ajax({
            method: 'POST',
            url: '/searchinfo',
            contentType: 'application/json',
            data: JSON.stringify({ tweetID: tweetID.val() }),
            success: function(response) {
                console.log(response);
                tweetID.val('');
                $('#get-searched-tweets').click();
				// display most recent tweets searched
            }
        });
  });

  //UPDATE/PUT
  $("#update-user").on('submit', function(event){
		event.preventDefault();
		var updateInput = $('#update-input');
		var inputString = updateInput.val();

		const parsedStrings = inputString.split(';');

		var name = parsedStrings[0];
		var newName = parsedStrings[1];
		
		//TODO: update a tweet
		$.ajax({
			method: 'PUT',
			// name passed in as argument for nm parameter
			url: '/tweets/' + name,
			contentType: 'application/json',
			data: JSON.stringify({ newScreenName: newName }),
			success: function(response) {
				console.log(response);
				updateInput.val('');
				$('#get-button').click();
				// Display current table of users
			}
		});
  });


  //DELETE
  $("#delete-form").on('submit', function() {
		var id = $('#delete-input');
		event.preventDefault();

		//TODO: delete a tweet
		$.ajax({
			method: 'DELETE',
			// id.val() as argument for tweetid parameter
			url: '/tweetinfo/' + id.val(),
			contentType: 'application/json',
			// Don't need to have data because id.val() passed in as an argument
			success: function(response) {
				console.log(response);
				id.val('');
				$('#get-tweets-button').click();
				// Display updated table of tweets
			}
		});
	});
});