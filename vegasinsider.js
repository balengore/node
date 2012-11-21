var rest = require("restler");
var cheerio = require("cheerio");
var eyes = require("eyes");

// var Firebase = require('firebase');
// var data_ref = new Firebase('https://gamma.firebase.com/balen/games/nfl/');
// data_ref.startAt('8', 'week').on('child_added', function(snapshot) {
//   console.log(snapshot.val());
// });

var options = { "Cache-Control": "no-cache,max-age=0", 
  "Pragma": "no-cache", 
  "User-Agent": "Mozilla/5.0 (Windows NT 6.0; WOW64) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7" 
};

sport = process.argv[2] ? process.argv[2] : "nfl"; 
week = process.argv[3] ? process.argv[3] : 9;

if (sport == "nfl") {
	url = "http://www.vegasinsider.com/nfl/matchups/matchups.cfm/week/" + week + "/season/2012";
} else {
 	url = "http://www.vegasinsider.com/college-football/matchups/matchups.cfm/week/" + week + "/season/2012";
}

rest.get(url, {headers: options}).on('complete', function(data) {
  // console.log(data);
  $ = cheerio.load(data);
  var sharp_favs = [];
  var sharp_dogs = [];
  var all_games = [];

  t = $(".viBodyBorderNorm").each(function(index, game_table){
    game_table = $(game_table);
    away_cells = $(game_table.find("tr")[2]).find("td");
    home_cells = $(game_table.find("tr")[3]).find("td");
    
    var v = $(away_cells[0]).text().replace(/[0-9]+ /, "");
    var h = $(home_cells[0]).text().replace(/[0-9]+ /, "");

    if (parseFloat($(away_cells[3]).text()) < 0) {
    	var initial_spread = parseFloat($(away_cells[3]).text());
    	var inital_over_under = parseFloat($(home_cells[3]).text());
    	var initial_favorite = "away";
    } else {
    	var initial_spread = parseFloat($(home_cells[3]).text());
    	var inital_over_under = parseFloat($(away_cells[3]).text());
    	var initial_favorite = "home";
    }

    if (parseFloat($(away_cells[4]).text()) < 0) {
    	var current_spread = parseFloat($(away_cells[4]).text());
    	var current_over_under = parseFloat($(home_cells[4]).text());
    	var current_favorite = "away";
    } else {
    	var current_spread = parseFloat($(home_cells[4]).text());
    	var current_over_under = parseFloat($(away_cells[4]).text());
    	var current_favorite = "home";
    }

    if (initial_favorite !== current_favorite) {
    	// console.log("Fav changed: " + v + "-" + h);
    }

    var line_move = initial_spread - current_spread;

    var v_spread_perc = $(away_cells[5]).text();
    var h_spread_perc = $(home_cells[5]).text();

    if ($(away_cells[8]).text().indexOf("Cover") > 0) {
    	var away_covered = true;
    	if (current_favorite === "away") {
    		var fav_covered = true;
    	} else {
    		var dog_covered = true;
    	}
    } else if ($(home_cells[8]).text().indexOf("Cover") > 0) {
    	var home_covered = true;
    	if (current_favorite === "home") {
    		var fav_covered = true;
    	} else {
    		var dog_covered = true;
    	}
    }
		// h_tt = game_table.find(".home .team-total").text().trim().replace(/\s{2,}/g, ' ');

		all_games.push({away: v, home: h, home_covered: home_covered, away_covered: away_covered, fav_covered: fav_covered, dog_covered: dog_covered});

    // check for sharp underdogs
    var fav_spread_perc = current_favorite === "home" ? parseInt(h_spread_perc.replace("%","")) : parseInt(v_spread_perc.replace("%",""));
    if (line_move < 0 && fav_spread_perc > 80) {
    	sharp_dogs.push({team: current_favorite === "home" ? v : h, percentage: ((100 - fav_spread_perc) + "%"), spread: current_spread, change: line_move,
    		home_covered: home_covered, away_covered: away_covered, fav_covered: fav_covered, dog_covered: dog_covered});
    }

    // check for sharp favs
    var fav_spread_perc = current_favorite === "home" ? parseInt(h_spread_perc.replace("%","")) : parseInt(v_spread_perc.replace("%",""));
    if (line_move > 0 && fav_spread_perc < 20) {
    	sharp_favs.push({team: (current_favorite === "home" ? h : v), percentage: (fav_spread_perc + "%"), spread: current_spread, change: line_move, 
    		home_covered: home_covered, away_covered: away_covered, fav_covered: fav_covered, dog_covered: dog_covered});
    }

    // console.log(v + " " + v_spread_perc + ", " + h + " " + h_spread_perc + ", line change: " + line_move);
  });
	// console.log(all_games);
	
	sharp_dog_record = {wins: 0, losses: 0, pushes: 0};
	sharp_fav_record = {wins: 0, losses: 0, pushes: 0};
	console.log("Sharp Underdogs:");
	$(sharp_dogs).each(function(index, game) { 
		if (game.dog_covered) {
			sharp_dog_record.wins++;
		} else {
			sharp_dog_record.losses++;
		}
	});
	console.log(sharp_dog_record);
	console.log(sharp_dogs);
	console.log("Sharp Favs:");
	$(sharp_favs).each(function(index, game) { 
		if (game.fav_covered) {
			sharp_fav_record.wins++;
		} else {
			sharp_fav_record.losses++;
		}
	});
	console.log(sharp_fav_record);
	console.log(sharp_favs);
});
