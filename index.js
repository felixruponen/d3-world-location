var express = require('express')
var geoip = require('geoip-lite');
// Load and instantiate Chance
var chance = require('chance').Chance(new Date().getTime());

var app = express()

var locations = [];

var locateIp = function(ip, iterations) {
	var geo = geoip.lookup(ip);
	if(!geo && iterations < 100) {
		ip = chance.ip();
		iterations++;
		return locateIp(ip, iterations);
	} else {
		return geo;
	}
}

app.use("/", function(req, res, next) {

	var ip = req.ip;
	console.log(req.ip);

	
	if(ip === "127.0.0.1") {
		ip = chance.ip();
	}

	console.log(ip);

	var geo = locateIp(ip, 0);
	console.log(geo);
	locations.push(geo);

	next();
});

app.use("/", express.static(__dirname));

app.get("/locations", function(req, res) {
	res.send(locations);
});



var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


