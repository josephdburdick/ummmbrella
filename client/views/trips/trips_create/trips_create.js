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
      setTimeout(function(){
        // Weather
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


        // Flickr
        $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
          tags: Session.get('destination'),
          tagmode: "any",
          format: "json"
        },
        function(data) {
          $.each(data.items, function(i,item){
            $("<img/>").attr("src", item.media.m).prependTo("#weather");
            if ( i == 10 ) return false;
          });
        });
      }, 2000);
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
  },
  selectedDate: function(){
    if (Session.get('leavingDate'))
      return Session.get('leavingDate');
    else
      return new Date();
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