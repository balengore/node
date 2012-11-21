var http = require("http");
var sys = require("sys");
var xml2js = require('xml2js'), eyes = require('eyes');
var rest = require('restler');

var parser = new xml2js.Parser({normalize: true, trim: true});
parser.on('end', function(result) {
  var base_url = "http://gamma.firebase.com/balen/games/nfl/";
  var week = result.ss.gms[0].$.w;
  var year = result.ss.gms[0].$.y;
  for (var index in result.ss.gms[0].g) {
    var dd = {};
    xml = result.ss.gms[0].g[index].$;
    dd["eid"] = xml.eid;
    dd["gsis"] = xml.gsis;
    dd["day"] = xml.d;
    dd["time"] = xml.t;
    dd["quarter"] = xml.q;
    dd["home_team"] = xml.h;
    dd["home_nickname"] = xml.hnn;
    dd["home_score"] = xml.hs;
    dd["away_team"] = xml.v;
    dd["away_nickname"] = xml.vnn;
    dd["away_score"] = xml.vs;
    dd["rz"] = xml.rz;
    dd["ga"] = xml.ga;
    dd["game_type"] = xml.gt;
    dd["week"] = week;
    dd["season"] = year;
    rest.put('http://gamma.firebase.com/balen/games/nfl/' + dd['eid'] + '.json', {
      data: JSON.stringify(dd),
    }).on('complete', function(data, response) {
      if (response.statusCode == 200) {
        eyes.inspect(data);
      } else {
        eyes.inspect(data);
      }
    }); 
  } 
});

// url = "http://www.nfl.com/liveupdate/scorestrip/ss.xml";
url = "http://www.nfl.com/ajax/scorestrip?season=2012&seasonType=REG&week=7&random=1350537207251";
http.get(url, function(res) {
  res.on('data', function (chunk) {
    parser.parseString(chunk);
  });
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});