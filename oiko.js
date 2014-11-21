var fs 		= require('fs'),
	request = require('request'),
	cheerio = require('cheerio');


var ids 		= [],
	listings 	= [],
	i 			= 0,
	jsonFile 	= 'card.json',
	baseUrl 	= 'http://asunnot.oikotie.fi/myytavat-asunnot/';

fs.readFile(jsonFile, 'utf-8', function(err, data) {
	
	if (err) {
		return console.error(err);
	}

	var json = JSON.parse(data);

	json.response.docs.forEach(function(card) {
		ids.push(card.card_id);
	});

	function getListingData(id) {
		setTimeout(function() {
			
			request(baseUrl + id, function(err, res, body) {
				
				var $ = cheerio.load(body),
					listing = {};
				
				$('.widget-card-information-table tr').each(function(i, el) {
					var prop = $(this).find('th').text().trim(),
						val = $(this).find('td').text().trim();
					
					listing[prop] = val;
					listings.push(listing);
				});
			});

			
			// test purposes
			if (i < 3) {
			// if (i < ids.length) {
				i++;
				getListingData(ids[i]);	
			}
			
		}, 1000);
	}

	// init loop
	getListingData(ids[i]);
});