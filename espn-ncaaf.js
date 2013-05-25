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


url = "http://m.espn.go.com/ncb/scoreboard?&groupId=50";
rest.get(url, {headers: options}).on('complete', function(data) {
  // console.log(data);
  $ = cheerio.load(data);
  t = $(".match").each(function(index, game_table){
    game_table = $(game_table);
    vat teams = game_table.find(".competitor .wide strong").text();
    var v = teams[0];
    var h = teams[1];

    var scores = game_table.find(".competitor td").text();
    var v_score = scores[1];
    var h_score = scores[3];

    var time = game_table.find("th").text();
    var date = $(game_table).closest(":has(.day-head)").find('.day-head').text();
    // h_tt = game_table.find(".home .team-total").text().trim().replace(/\s{2,}/g, ' ');

    console.log(v + " " + v_score + ", " + h + " " + h_score + ", time: " + time);
  });
});
