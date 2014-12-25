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
		

	getForecast: function(){
		var result = HTTP.get(wuUrl('forecast', 'VA/Richmond'));
		return result + "Hello";
	}
	//forecast/q/CA/San_Francisco.json	


});