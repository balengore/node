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


// url = "http://m.betus.com.pa/sportsbook/ncaa-football-game-lines.aspx";
// url = "http://www.betus.com.pa/sportsbook/college-football-lines.aspx";
// url = "http://www.betus.com.pa/sportsbook/nfl-football-lines.aspx";
url = "http://www.betus.com.pa/sportsbook/ncaa-basketball-lines.aspx";
rest.get(url, {headers: options}).on('complete', function(data) {
	// console.log(data);
	$ = cheerio.load(data);
	t = $(".normal .game-tbl").each(function(index, game_table){
		game_table = $(game_table);
		v = game_table.find(".visitor .team").text().trim();
		v_p = game_table.find(".visitor .points").text().trim().replace(/\s{2,}/g, ' ');
		v_m = game_table.find(".visitor .money").text().trim();
		v_t = game_table.find(".visitor .total").text().trim().replace(/\s{2,}/g, ' ');
		v_tt = game_table.find(".visitor .team-total").text().trim().replace(/\s{2,}/g, ' ');

		h = game_table.find(".home .team").text().trim();
		h_p = game_table.find(".home .points").text().trim().replace(/\s{2,}/g, ' ');
		h_m = game_table.find(".home .money").text().trim();
		h_t = game_table.find(".home .total").text().trim().replace(/\s{2,}/g, ' ');
		h_tt = game_table.find(".home .team-total").text().trim().replace(/\s{2,}/g, ' ');

		console.log(v + " " + v_p + " " + v_m + " " + v_t + " " + v_tt + ", " + h + " " + h_p + " " + h_m + " " + h_t + " " + h_tt);
	});
});
