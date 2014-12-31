/*****************************************************************************/
/* Trips Methods */
/*****************************************************************************/
var wuKey = process.env.WEATHER_UNDERGROUND_KEY,
		wuFeature = function (f){
			console.log('Feature:' + f);
			if (!f) f = "forecast"; return f;
		},
		wuQuery = function (q){
			console.log('Q: ' + q);
			if (!q) q = "NY/New_York"; return q;
		},	
		wuUrl = function(f, q){
			return "http://api.wunderground.com/api/"+ wuKey +"/"+ wuFeature(f) +"/q/"+ wuQuery(q) + ".json";
		};	
		
Meteor.methods({
 /*
	* Example:
	*  '/app/trips/update/email': function (email) {
	*    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
	*  }
	*
	*/
	// var 
	// 	wuKey = process.env.WEATHER_UNDERGROUND_KEY,
	// 	wuQuery = function (q){
	// 		if (!q) q = "forecast";
	// 	},	
	// 	wuUrl = "http://api.wunderground.com/api/"+ wuKey +"/"+ wuQuery + "/" + query + ".json";
		

	getForecast: function(template){

		// var result = HTTP.get(wuUrl('forecast', place));
		// Session.set('forecast', result);
		// return result + "Hello";
		// return Meteor.http.call('GET', 'http://api.openweathermap.org/data/2.5/weather?q='+ city)
		// return HTTP.get('http://api.wunderground.com/api/ab9dbf6db769825d/forecast/q/CA/San_Francisco.json');
		
	}
	//forecast/q/CA/San_Francisco.json	


});