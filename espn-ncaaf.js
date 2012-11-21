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


url = "http://m.espn.go.com/ncf/scoreboard?";
rest.get(url, {headers: options}).on('complete', function(data) {
  // console.log(data);
  $ = cheerio.load(data);
  t = $(".match").each(function(index, game_table){
    game_table = $(game_table);
    var v = game_table.find(".away-competitor .competitor-name").text();
    var h = game_table.find(".home-competitor .competitor-name").text();

    var v_score = game_table.find(".away-competitor td").last().text();
    var h_score = game_table.find(".home-competitor td").last().text();

    var time = game_table.find("th").text();

    // h_tt = game_table.find(".home .team-total").text().trim().replace(/\s{2,}/g, ' ');

    console.log(v + " " + v_score + ", " + h + " " + h_score + ", time: " + time);
  });
});
