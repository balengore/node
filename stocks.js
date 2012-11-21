var rest = require("restler");
var eyes = require("eyes");
var gauss = require('gauss');
var fs = require('fs');

// url = "http://ichart.finance.yahoo.com/table.csv?a=00&b=1&c=2011&d=11&e=31&f=2011&g=d&ignore=.csv&s=AAPL";

var sharpe_map = {}
var symbols = ["GLD","SPY","$SPX","$DJI","IYR","$VIX","SH","SDS"];
// var symbols = ["A", "AA", "AAPL", "ABC", "ABT"];
// var symbols = ["A", "AA", "AAPL", "ABC", "ABT", "ACE", "ACN", "ADBE", "ADI", "ADM", "ADP", "ADSK", "AEE", "AEP", "AES", "GOOG", "VNO"];
// var symbols = ["A", "AA", "AAPL", "ABC", "ABT", "ACE", "ACN", "ADBE", "ADI", "ADM", "ADP", "ADSK", "AEE", "AEP", "AES", "AET", "AFL", "AGN", "AIG", "AIV", "AIZ", "AKAM", "ALL", "ALTR", "ALXN", "AMAT", "AMD", "AMGN", "AMP", "AMT", "AMZN", "AN", "ANF", "ANR", "AON", "APA", "APC", "APD", "APH", "APOL", "ARG", "ATI", "AVB", "AVP", "AVY", "AXP", "AZO", "BA", "BAC", "BAX", "BBBY", "BBT", "BBY", "BCR", "BDX", "BEAM", "BEN", "BF.B", "BHI", "BIG", "BIIB", "BK", "BLK", "BLL", "BMC", "BMS", "BMY", "BRCM", "BRK.B", "BSX", "BTU", "BXP", "C", "CA", "CAG", "CAH", "CAM", "CAT", "CB", "CBE", "CBG", "CBS", "CCE", "CCI", "CCL", "CELG", "CERN", "CF", "CFN", "CHK", "CHRW", "CI", "CINF", "CL", "CLF", "CLX", "CMA", "CMCSA", "CME", "CMG", "CMI", "CMS", "CNP", "CNX", "COF", "COG", "COH", "COL", "COP", "COST", "COV", "CPB", "CRM", "CSC", "CSCO", "CSX", "CTAS", "CTL", "CTSH", "CTXS", "CVC", "CVH", "CVS", "CVX", "D", "DD", "DE", "DELL", "DF", "DFS", "DGX", "DHI", "DHR", "DIS", "DISCA", "DLTR", "DNB", "DNR", "DO", "DOV", "DOW", "DPS", "DRI", "DTE", "DTV", "DUK", "DV", "DVA", "DVN", "EA", "EBAY", "ECL", "ED", "EFX", "EIX", "EL", "EMC", "EMN", "EMR", "EOG", "EQR", "EQT", "ESRX", "ESV", "ETFC", "ETN", "ETR", "EW", "EXC", "EXPD", "EXPE", "F", "FAST", "FCX", "FDO", "FDX", "FE", "FFIV", "FHN", "FII", "FIS", "FISV", "FITB", "FLIR", "FLR", "FLS", "FMC", "FOSL", "FRX", "FSLR", "FTI", "FTR", "GAS", "GCI", "GD", "GE", "GILD", "GIS", "GLW", "GME", "GNW", "GOOG", "GPC", "GPS", "GS", "GT", "GWW", "HAL", "HAR", "HAS", "HBAN", "HCBK", "HCN", "HCP", "HD", "HES", "HIG", "HNZ", "HOG", "HON", "HOT", "HP", "HPQ", "HRB", "HRL", "HRS", "HSP", "HST", "HSY", "HUM", "IBM", "ICE", "IFF", "IGT", "INTC", "INTU", "IP", "IPG", "IR", "IRM", "ISRG", "ITW", "IVZ", "JBL", "JCI", "JCP", "JDSU", "JEC", "JNJ", "JNPR", "JOY", "JPM", "JWN", "K", "KEY", "KFT", "KIM", "KLAC", "KMB", "KMI", "KMX", "KO", "KR", "KSS", "L", "LEG", "LEN", "LH", "LIFE", "LLL", "LLTC", "LLY", "LM", "LMT", "LNC", "LO", "LOW", "LRCX", "LSI", "LTD", "LUK", "LUV", "LXK", "LYB", "M", "MA", "MAR", "MAS", "MAT", "MCD", "MCHP", "MCK", "MCO", "MDT", "MET", "MHP", "MJN", "MKC", "MMC", "MMM", "MNST", "MO", "MOLX", "MON", "MOS", "MRK", "MRO", "MS", "MSFT", "MSI", "MTB", "MU", "MUR", "MWV", "MYL", "NBL", "NBR", "NDAQ", "NE", "NEE", "NEM", "NFLX", "NFX", "NI", "NKE", "NOC", "NOV", "NRG", "NSC", "NTAP", "NTRS", "NU", "NUE", "NVDA", "NWL", "NWSA", "NYX", "OI", "OKE", "OMC", "ORCL", "ORLY", "OXY", "PAYX", "PBCT", "PBI", "PCAR", "PCG", "PCL", "PCLN", "PCP", "PCS", "PDCO", "PEG", "PEP", "PFE", "PFG", "PG", "PGR", "PH", "PHM", "PKI", "PLD", "PLL", "PM", "PNC", "PNW", "POM", "PPG", "PPL", "PRGO", "PRU", "PSA", "PWR", "PX", "PXD", "QCOM", "QEP", "R", "RAI", "RDC", "RF", "RHI", "RHT", "RL", "ROK", "ROP", "ROST", "RRC", "RRD", "RSG", "RTN", "S", "SAI", "SBUX", "SCG", "SCHW", "SE", "SEE", "SHLD", "SHW", "SIAL", "SJM", "SLB", "SLM", "SNA", "SNDK", "SNI", "SO", "SPG", "SPLS", "SRCL", "SRE", "STI", "STJ", "STT", "STX", "STZ", "SUN", "SWK", "SWN", "SWY", "SYK", "SYMC", "SYY", "T", "TAP", "TDC", "TE", "TEG", "TEL", "TER", "TGT", "THC", "TIE", "TIF", "TJX", "TMK", "TMO", "TROW", "TRV", "TSN", "TSO", "TSS", "TWC", "TWX", "TXN", "TXT", "TYC", "UNH", "UNM", "UNP", "UPS", "URBN", "USB", "UTX", "V", "VAR", "VFC", "VIAB", "VLO", "VMC", "VNO", "VRSN", "VTR", "VZ", "WAG", "WAT", "WDC", "WEC", "WFC", "WFM", "WHR", "WIN", "WLP", "WM", "WMB", "WMT", "WPI", "WPO", "WU", "WY", "WYN", "WYNN", "X", "XEL", "XL", "XLNX", "XOM", "XRAY", "XRX", "YHOO", "YUM", "ZION", "ZMH"];
// var symbols = ['OKE','MCD','SO','ALXN','ROST','ED','ISRG','BMY','DUK','TJX','PM','HSY','MNST','DLTR','HUM','BIIB','COG','NI','MO','D','RAI','MA','LO','PRGO','KMB','CMG','VFC','FAST','V','ORLY','KFT','LTD','LLY','CNP','DTE','GWW','XEL','ABT','UNH','WEC','SBUX','IBM','PSA','SE','NEE','CAG','PFE','PNW','AZO','AET'];
var sharpe_values = new gauss.Vector();
var sharpe_symbols = new gauss.Vector();
var bad_symbols = 0;
symbols.forEach(function (symbol) {
	url = "http://ichart.finance.yahoo.com/table.csv?a=00&b=1&c=2011&d=11&e=31&f=2011&g=d&ignore=.csv&s=" + symbol;
	rest.get(url).on('complete', function(data, resp) {
	// fs.readFile("stocks/" + symbol + ".txt", function (err, data) {
  	// if (err) throw err;
	  // var symbol = resp.req.path.split("=").pop();
	  // console.log(symbol);

	  lines = data.toString().split('\n');
	  prices = [];
	  cum_returns= [];
	  daily_returns = [0];
	  for(var i = 0; i < lines.length - 2; i++) {
	  	var p = parseFloat(lines[i + 1].split(",").pop());
	  	prices.unshift(p);
	  }

	  for(var i = 0; i < prices.length; i++) {
	  	cum_returns.push(prices[i]/prices[0]);
	  	if (i > 0) {
	  		var day_ret = (cum_returns[i]/cum_returns[i-1]) - 1
	  		daily_returns.push(day_ret);
	  	}
	  }
	  var v = prices.toVector();
	  var v_day_ret = daily_returns.toVector();
	  var avg_day_ret = v_day_ret.mean();
	  var std_dev_day_ret = v_day_ret.stdev();
	  var sharpe_ratio = Math.sqrt(v.length) * (avg_day_ret/std_dev_day_ret)
	  // console.log(prices);
	  // console.log(v.length);
	  console.log(symbol);
	  console.log(avg_day_ret);
	  console.log(std_dev_day_ret);
	  if (!isNaN(sharpe_ratio)) {
	  	console.log(sharpe_ratio);
	  	sharpe_values.push(sharpe_ratio);
	  	sharpe_symbols.push(symbol);
	  } else {
	  	bad_symbols += 1;
	  }

	  var new_data = "";
	  for(var i = 0; i < prices.length; i++) {
	  	new_data += prices[i] + "," + daily_returns[i] + "," + cum_returns[i] + "\n";
	  }

	  fs.writeFile("stocks/" + symbol + "_1.txt", new_data, function(err) {
		  if(err) {
		  	console.log(err);
		  } else {
		  	console.log("The file was saved!");
		  }
		}); 
	  // console.log(sharpe_values.length + " of " + (symbols.length - bad_symbols));
	  if (sharpe_values.length === (symbols.length - bad_symbols)) {
	  	var top50 = [];
	  	for (var k = 0; k < 50; k++) {
	  		var max = sharpe_values.max();
	  		var index = sharpe_values.indexOf(max);
	  		// console.log(index);
	  		console.log(sharpe_symbols[index] + ", " + max);
	  		top50.push(sharpe_symbols[index]);
	  		sharpe_values.splice(index, 1);
	  		sharpe_symbols.splice(index, 1);
	  	}
	  	console.log("['" + top50.join("','") + "']");
	  }
	});
});