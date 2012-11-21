var gauss = require('gauss');
var fs = require('fs');

symbols = ['OKE','MCD','SO','ALXN','ROST','ED','ISRG','BMY','DUK','TJX','PM','HSY','MNST','DLTR','HUM','BIIB','COG','NI','MO','D','RAI','MA','LO','PRGO','KMB','CMG','VFC','FAST','V','ORLY','KFT','LTD','LLY','CNP','DTE','GWW','XEL','ABT','UNH','WEC','SBUX','IBM','PSA','SE','NEE','CAG','PFE','PNW','AZO','AET'];
// symbols = ['PM','HSY','MNST','DLTR','HUM','BIIB','COG','NI']
// var price_map = {};
var day_ret_map = {};
// var cum_ret_map = {};
var count = 0;
var max = 0;
var combos = 0;
symbols.forEach(function (symbol) {
	fs.readFile("stocks/" + symbol + "_1.txt", function (err, data) {
  	if (err) throw err;

	  lines = data.toString().split('\n');
	  d = [];

	  for(var i = 0; i < lines.length; i++) {
	  	var vals = lines[i].split(",");
	  	d.push(parseFloat(vals[2]));
	  }

	  day_ret_map[symbol] = d;
	  count++;
	  if (count == symbols.length) {
	  	combos = 0;
	  	for (var i1 = 0; i1 < 47; i1++) {
	  		for (var i2 = i1+1; i2 < 48; i2++) {
	  			for (var i3 = i2+1; i3 < 49; i3++) {
	  				for (var i4 = i3+1; i4 < 50; i4++) {
	  					combos++;
	  					s1 = symbols[i1];
	  					s2 = symbols[i2];
	  					s3 = symbols[i3];
	  					s4 = symbols[i4];
	  					for (var i = 1; i < 10; i++) {
	  						for (var j = 1; j < 10; j++) {
	  							for (var k = 1; k < 10; k++) {
	  								for (var l = 1; l < 10; l++) {
	  									if ((i + j + k + l) != 10) {
	  										continue;
	  									}
					  					cum_returns = new gauss.Vector();
					  					daily_returns = new gauss.Vector();
					  					for (m = 0; m < 252; m++) {		
					  						var s1c = day_ret_map[s1][m];
					  						var s2c = day_ret_map[s2][m];
					  						var s3c = day_ret_map[s3][m];
					  						var s4c = day_ret_map[s4][m];
					  						cum_returns.push((i/10) * s1c + (j/10) * s2c + (k/10) * s3c + (l/10) * s4c);
					  						if (m > 0) {
					  							daily_returns.push(cum_returns[m]/cum_returns[m-1] - 1);
					  						} else {
						  						daily_returns.push(0);
					  						}
					  					}
					  					var avg_day_ret = daily_returns.mean();
					  					var std_dev_day_ret = daily_returns.stdev();
					  					var sharpe = Math.sqrt(252) * (avg_day_ret/std_dev_day_ret);
					  					if (sharpe > max) {
					  						max = sharpe;
					  						console.log(sharpe + ": " + s1 + " " + i/10 + "," + s2 + " " + j/10 + "," + s3 + " " + k/10 + "," + s4 + " " + l/10);
					  					}
					  				}
	  							}
	  						}
	  					}
	  					// console.log(i1 + " " + i2 + " " + i3 + " " + i4);
	  					if (combos % 1000 == 0) {
	  						console.log("count: " + combos);
	  					}
	  				}
	  			}
	  		}
	  	}
	  	// combos = 0;
	  	// symbols.slice(0, 47).forEach(function(s1, i1) {
	  		// symbols.slice(i1+1, 48).forEach(function(s2, i2) {
	  			// symbols.slice(i2+1, 49).forEach(function(s3, i3) {
	  				// symbols.slice(i3+1, 50).forEach(function(s4, i4) {
	  					// if (s1 === s2 || s1 === s3 || s1 === s4 || s2 === s3 || s2 === s4 || s3 === s4) {
	  					// 	return;
	  					// } 
	  					// combos++;
	  					// console.log(i1 + " " + s1 + " " + i2 + " " + s2 + " " + i3 + " " + s3 + " " + i4 + " " + s4);
	  					// if (combos % 1000 == 0) {
	  						// console.log("count: " + combos);
	  					// }
	  					// var cum_returns = new gauss.Vector();
	  					// var daily_returns = new gauss.Vector();
	  					// for (i = 0; i < 252; i++) {
	  					// 	var s1c = day_ret_map[s1][i];
	  					// 	var s2c = day_ret_map[s2][i];
	  					// 	var s3c = day_ret_map[s3][i];
	  					// 	var s4c = day_ret_map[s4][i];
	  					// 	cum_returns.push(.25 * s1c + .25 * s2c + .25 * s3c + .25 * s4c);
	  					// 	if (i > 0) {
	  					// 		daily_returns.push(cum_returns[i]/cum_returns[i-1] - 1);
	  					// 	} else {
		  				// 		daily_returns.push(0);
	  					// 	}
	  					// }
	  					// var avg_day_ret = daily_returns.mean();
	  					// var std_dev_day_ret = daily_returns.stdev();
	  					// var sharpe = Math.sqrt(252) * (avg_day_ret/std_dev_day_ret);
	  					// if (sharpe > max) {
	  					// 	max = sharpe;
	  					// 	console.log(sharpe + ": " + s1 + "," + s2 + "," + s3 + "," + s4);
	  					// 	console.log(combos);
	  					// }
	  					// console.log("day_ret: " + daily_returns.length);
	  					// console.log(daily_returns);
	  					// console.log("cum_ret: " + cum_returns.length );
	  					// console.log(cum_returns);
	  				// });
	  			// });
	  		// });
	  	// });
	  }
	});
});
