/*****************************************************************************/
/* Trips Methods */
/*****************************************************************************/		
Meteor.methods({
 /*
	* Example:
	*  '/app/trips/update/email': function (email) {
	*    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
	*  }
	*
	*/
	
	geocodeLocation: function(coords){

		var lat = coords.lat,
			lon = coords.lon;
		if (coords)
			return Meteor.http.call('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&sensor=true');
		else
			return "Coordinates not defined.";
	},  
	getForecast: function(template){

	}
});