/*****************************************************************************/
/* Simpleweather: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Simpleweather.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
});

Template.Simpleweather.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* Simpleweather: Lifecycle Hooks */
/*****************************************************************************/
Template.Simpleweather.created = function () {
  
};

Template.Simpleweather.rendered = function () {
  // $(document).ready(function() {
  $.simpleWeather({
    location: 'Austin, TX',
    woeid: '',
    unit: 'f',
    success: function(weather) {
      html = '<p>'+weather.temp+'&deg;'+weather.units.temp+'</p>';
  
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
// });
};

Template.Simpleweather.destroyed = function () {
};