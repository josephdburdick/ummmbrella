/*****************************************************************************/
/* TripsCreate: Event Handlers and Helpers .js*/
/*****************************************************************************/

Template.TripsCreate.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */

    'click #trip-getLocation': function(e, template){
      navigator.geolocation.getCurrentPosition(function(position) {
        Session.set('coords', {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });

        var coords = Session.get('coords');

        Meteor.call('geocodeLocation', coords, function(e, response){
          var location = {
            hood: response.data.results[2].address_components[0].short_name,
            city: response.data.results[2].address_components[1].short_name,
            state: response.data.results[2].address_components[4].short_name,
            country: response.data.results[2].address_components[5].short_name
          };
          Session.set('geocodeLocation', location);
          
        });
          
      });
    },
    'keyup input': function (e, template) {
      Session.set('origin-location', $('#origin-location').val());
      Session.set('destination-location', $('#destination-location').val());
    },

    'submit form': function(e, template){
      e.preventDefault();
      console.log('origin: ', Session.get('origin-location'));
      console.log('destination: ', Session.get('destination-location'));
      if (!$('form #weather').length)
        $('form').append('<div id="weather"></div>');
      setTimeout(function(){
        // Weather
        $.simpleWeather({
          location: Session.get('destination'),
          woeid: '',
          unit: 'f',
          success: function(weather) {
            debugger;
            html = '<p>'+weather.temp+'&deg; in '+ Session.get('destination')+ '</p>';

            $("#weather").html(html);
          },
          error: function(error) {
            $("#weather").html('<p>'+error+'</p>');
          }
        });
      }, 2000);
    }
});

Template.TripsCreate.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
  destination: function (){
    if (Session.get('destination'))
      return Session.get('destination');
    else
      return "Destination";
  },
  selectedDate: function(){
    if (Session.get('leavingDate'))
      return Session.get('leavingDate');
    else
      return new Date();
  },
  coords: function() { return Session.get('coords'); },
  currentLocation: function(){
    if (Session.get('geocodeLocation')){
      var l = Session.get('geocodeLocation');  
      return l.hood + ", " + l.city + ", " + l.state; 
    } else {
      return "";
    }
    
  }
});

/*****************************************************************************/
/* TripsCreate: Lifecycle Hooks */
/*****************************************************************************/
Template.TripsCreate.created = function () {

  // if (!Session.get('coords')){
  //   var coords = geoLocate();
  //   debugger;
  // }
  // Meteor.call('geocodeCity', coords, function(error, result){
  //   Session.set('geocodeCity', result);
  // });
  // console.log("Geocode City is ", Session.get('geocodeCity'));
};

Template.TripsCreate.rendered = function () {
  
};

Template.TripsCreate.destroyed = function () {
  Meteor.clearInterval(getGeolocation);
};