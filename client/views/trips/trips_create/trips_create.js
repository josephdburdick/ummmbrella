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

    },
    'click #trip-getLocation': function(e, template){
      $('body').append('<div class="loader"></div>');
      navigator.geolocation.getCurrentPosition(function(position) {
        Session.set('coords', {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        var coords = Session.get('coords');
        Meteor.call('geocodeLocation', coords, function(e, response){
          var location = {
            hood: response.data.results[1].address_components[1].short_name,
            city: response.data.results[2].address_components[1].short_name,
            state: response.data.results[2].address_components[3].short_name,
            country: response.data.results[2].address_components[4].short_name
          };

          Session.set('geocodeLocation', location);
          $('.loader').remove();
        });
        $(e.currentTarget).closest('.input-group').addClass('floating-label-form-group-with-value');
        if (!Session.get('selectedDate')){
          $(e.currentTarget).closest('.input-group').next('.input-group').find('input')
            .focus()
              .val(Session.get('tomorrowsDatetime'))
            .closest('.input-group')
              .addClass('floating-label-form-group-with-value');
        }  
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
  
  selectedDate: function(options){
    if (Session.get('leavingDate'))
      return Session.get('leavingDate');
    else
      return Session.get('tomorrowsDatetimeLocal');
  },
  leavingDateTime: function(options){

    if (Session.get('leavingDateTime'))
      return Session.get('leavingDateTime');
    else
      return Session.get('tomorrowsDatetimeLocal');
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

var timeUpdate = function(options){
  var timerId;
  if (options.getset === true){  
    timerId = Meteor.setInterval(function(){
      Session.set("tomorrowsDatetime", moment().add(1, 'days').calendar());
      Session.set("tomorrowsDatetimeLocal", moment().add(1, 'days').format('MMMM Do YYYY, h:mm:ss a'));
    }, 1000 );
    console.log('timerId starting:', timerId);
    if (options.el)
      $(options.el[0]).attr('data-timerId', timerId);
  } else {
    if (options.el){
      $(options.el).attr('data-timerId', timerId);
    }
    console.log('timerId stopping:', timerId);
    Meteor.clearInterval(timerId);  
  } 
  
    
  return timerId; 
};




/*****************************************************************************/
/* TripsCreate: Lifecycle Hooks */
/*****************************************************************************/
Template.TripsCreate.created = function () {

};

Template.TripsCreate.rendered = function () {
  // Initiate bootstrap tooltips.
  $("[data-toggle=tooltip]").tooltip({ container: 'body'});



  // Initiate form datetimepickers
  $('.form-datepicker').each(function(i , el){
    var thisTime = new Date().valueOf()
    $(el).datetimepicker({
        startDate: new Date()
        // format: 'yyyy-mm-dd hh:ii'
      }).on('changeDate', function(e){
        console.log(e);
        if (e.date.valueOf() > new Date().valueOf()){ 
          // var currentDateTime = $(e.currentTarget).data('value');
          //find value of calendar in ever event
        
          var timerId = timeUpdate({
            el: $(e.currentTarget),
            getset: false
          });
          Meteor.clearInterval(timerId);
          var selected = {
            datetime: $(e.currentTarget).data('datetime'),
            datetimeLocal: $(e.currentTarget).val()
          };

          $(e.currentTarget)
            .data('datetime', selected.datetime)
            .val(selected.datetimeLocal)
            .closest('.input-group').addClass('floating-label-form-group-with-value');
                   
        }
    });
    timeUpdate({
      el: el,
      getset: true
    });;
  });


    



  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });
};

Template.TripsCreate.destroyed = function () {

};