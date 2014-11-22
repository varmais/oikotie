var fs 		= require('fs'),
	request = require('request'),
	cheerio = require('cheerio'),
	csv		= require('fast-csv'),
	args	= process.argv.slice(2);


var ids 		= [],
	listings 	= [],
	i 			= 0,
	reqDelay	= 1000,
	jsonFile 	= args[0],
	baseUrl 	= 'http://asunnot.oikotie.fi/myytavat-asunnot/'
	dataFile	= args[1];

function getListingData(id) {
	setTimeout(function() {

		request(baseUrl + id, function(err, res, body) {

			console.log("Requesting listing " + (i+1) + " of " + ids.length);

			var $ = cheerio.load(body),
			listing = {};

			$('.widget-card-information-table tr').each(function(i, el) {
				var prop = $(this).find('th').text().trim(),
				val = $(this).find('td').text().trim().replace('\n', ' ');

				listing[prop] = val;
			});

			listings.push(listing);

			// test purposes
			//if (i < 3) {
			if (i < ids.length) {
				i++;
				getListingData(ids[i]);
			} else {
				csv.writeToPath(dataFile, listings, {headers: true}).on('finish', function() {
					console.log('Done writing data. Check ' + dataFile);
				});
			}
		});
	}, reqDelay);
}

fs.readFile(jsonFile, 'utf-8', function(err, data) {

	if (err) {
		return console.error(err);
	}

	var json = JSON.parse(data);

	json.response.docs.forEach(function(card) {
		ids.push(card.card_id);
	});

	// init loop
	getListingData(ids[i]);
});
