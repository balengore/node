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


url = "http://sportstap.mobi/ncaafootball/games.php?week=&focus=Top+25&cookiefailed=&timezoneGMTOffset=7";
rest.get(url, {headers: options}).on('complete', function(data) {
  // console.log(data);
  $ = cheerio.load(data);
  t = $(".game").each(function(index, game_table){
    game_table = $(game_table);
    var teams = game_table.find(".team");
    var v = teams.first().text();
    var h = teams.last().text();

    var scores = game_table.find(".score").html();

    if (scores) {
      var v_score = scores.split("<br>")[0];
      var h_score = scores.split("<br>")[1];
    }

    var time = game_table.find("td.status").text();

    // h_tt = game_table.find(".home .team-total").text().trim().replace(/\s{2,}/g, ' ');

    console.log(v + " " + v_score + ", " + h + " " + h_score + ", time: " + time);
  });
});
