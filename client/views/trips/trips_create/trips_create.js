/*****************************************************************************/
/* TripsCreate: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.TripsCreate.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */

    'keyup input': function (e, template) {
      Session.set('destination', e.target.value);
      if (!$('form #weather').length)
        $('form').append('<div id="weather"></div>');
      $.simpleWeather({
        location: Session.get('destination'),
        woeid: '',
        unit: 'f',
        success: function(weather) {
          html = '<p>'+weather.temp+'&deg; in '+ Session.get('destination')+ '</p>';

          $("#weather").html(html);
        },
        error: function(error) {
          $("#weather").html('<p>'+error+'</p>');
        }
      });
    },







    'submit form': function(e, template){
      e.preventDefault();
      //var dest = (Session.get('destination'));

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

  }
});

/*****************************************************************************/
/* TripsCreate: Lifecycle Hooks */
/*****************************************************************************/
Template.TripsCreate.created = function () {
};

Template.TripsCreate.rendered = function () {
};

Template.TripsCreate.destroyed = function () {
};