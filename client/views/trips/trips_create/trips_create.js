/*****************************************************************************/
/* TripsCreate: Event Handlers and Helpers .js*/
/*****************************************************************************/

var timeUpdate = function(options){
  var id = $(options.el).attr('data-timerid');
  if (id && options.getset === false){
    clearTimer(id);
    $(options.el).removeAttr('data-timerid');
  } else if (options.el && options.getset === true){
    if (!$(options.el).attr('data-timerid')){
      var timerId = setInterval(function(){        
        $(options.el).val(Session.get('currentDatetime'));    
      }, 1000);
      $(options.el).attr('data-timerid', timerId)  
    }    
  }
  return id; 
};

// Clear Timers
var clearTimer = function(id){
  window.clearInterval(id);
  Meteor.clearInterval(id);
};

// Toggle Floating Label
var toggleLabel = function (e, toggle){
  // if e is not an event create an "event" out of an element
  if (!e.currentTarget){
    var el = e, 
        e = {};
        e.currentTarget = el;
  }
  if (toggle === true){
    $(e.currentTarget)
    .closest('.form-group')
      .find('input.form-control')
    .closest('.form-group')
      .addClass('floating-label-form-group-with-value')
    .next('.form-group');
  } else if (toggle === false){
    $(e.currentTarget)
    .closest('.form-group')
      .find('input.form-control')
      .focus()
    .closest('.form-group')
      .removeClass('floating-label-form-group-with-value');
  }
}
var timersArray = [];
Template.TripsCreate.events({
  'click .trip-getDatetime': function(e, template){
    e.preventDefault();
    var datetimeInput = $(e.currentTarget).closest('.form-group').find('.form-datepicker')
    bootbox.dialog({
      message: "Are you leaving now or later?",
      title: "Choose Departure Time",
      buttons: {
        success: {
          label: "Leaving Now",
          className: "btn-success",
          callback: function() {
            timeUpdate({ el: $(datetimeInput[0]), getset: true });
            datetimeInput.datetimepicker('hide');
            toggleLabel(datetimeInput, true);
          }
        },   
        main: {
          label: "Leaving Later",
          className: "btn-primary",
          callback: function() {
            timeUpdate({ el: $(datetimeInput[0]), getset: false });
            datetimeInput.datetimepicker('show');
          }
        }
      }
    });      
  },

  'click #trip-getLocation': function(e, template){
    if (!$('.loader').length)
      $('body').append('<div class="loader"></div>');  
    
    function success(position){
        Session.set('coords', {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      var coords = Session.get('coords'), location;

      Meteor.call('geocodeLocation', coords, function(e, response){
        location = {
          hood: response.data.results[1].address_components[1].short_name,
          city: response.data.results[2].address_components[1].short_name,
          state: response.data.results[2].address_components[3].short_name,
          country: response.data.results[2].address_components[4].short_name
        };
        Session.set('geocodeLocation', location);
        $('.loader').remove();
        toggleLabel($('#origin-location'), true);
      });
    };
    function error(err){
      bootbox.confirm("Location not detected. Try again?", function(result) {
        if (result){
          geolocate();
        } else {
          bootbox.alert('Sorry, but you location could not be detected. Please enter your city and state in the depature field.');
          return;
        }
      }); 
      $('.loader').remove();

    };
    var geolocate = function(){
      navigator.geolocation.getCurrentPosition(success);  
    };
    geolocate();
  },

  'keyup input': function (e, template) {
    Session.set('origin-location', $('#origin-location').val());
    Session.set('destination-location', $('#destination-location').val());
    // setTimeout(function(){
      if ($(e.currentTarget).hasClass('location-control')){
        $.get("http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+ e.currentTarget.value, function(data){
          
            $(e.currentTarget).typeahead({ source: data });
            console.log(data);
        },'json');
      }
    // }, 500);
    
    e.currentTarget.value !=="" ? toggleLabel(e, true) : toggleLabel(e, false);
  },

  'change #oneway-toggle': function(e, template){
    Session.set('oneway', e.currentTarget.checked);
  },

  'submit form': function(e, template){
    e.preventDefault();
    // console.log('origin: ', Session.get('origin-location'));
    // console.log('destination: ', Session.get('destination-location'));
    if (!$('form #weather').length)
      $('form').append('<div id="weather"></div>');
    setTimeout(function(){
      // Weather
      $.simpleWeather({
        location: Session.get('destination'),
        woeid: '',
        unit: 'f',
        success: function(weather) {
          // debugger;
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
  trips: function(){
    return Trips.find({});
  },
  lastTrip: function(){
    var id = this._id;
    return _.last(Trips.find({})) == this.id;;
  },
  destination: function (){
    if (Session.get('destination'))
      return Session.get('destination');
  },
  selectedDate: function(options){
    if (Session.get('leavingDate'))
      return Session.get('leavingDate');
    else
      return Session.get('tomorrowsDatetimeLocal');
  },
  leavingDatetime: function(options){
    if (Session.get('leavingDatetime'))
      return Session.get('leavingDatetime');
  },
  currentDatetime: function(){
    return Session.get('currentDatetime');
  },

  currentDatetimeLocal: function(){
    return Session.get('currentDatetimeLocal');
  },

  coords: function() { return Session.get('coords'); },

  oneway: function() {
    if (Session.get('oneway'))
      return Session.get('oneway');
  },
  currentLocation: function(){
    if (Session.get('geocodeLocation')){
      var l = Session.get('geocodeLocation');  
      return l.city + ", " + l.state; 
    } else {
      return "";
    }
  }
});

// Current time
var currentTimeLoop = function(){
  Meteor.setInterval(function(){
    var current = {}
    Session.set("currentDatetime", moment().format('MMMM Do YYYY, h:mm:ss a'));
    Session.set("currentDatetimeLocal", moment().calendar());
    current.datetime = Session.get("currentDatetime");
    current.datetimelocal = Session.get("currentDatetimelocal");
    return current;
  }, 1000);
};
currentTimeLoop();


/*****************************************************************************/
/* TripsCreate: Lifecycle Hooks */
/*****************************************************************************/
Template.TripsCreate.created = function () {
  
};

Template.TripsCreate.rendered = function () {
  var timerArray = [];

  // Initiate bootstrap tooltips.
  $("[data-toggle=tooltip]").tooltip({ container: 'body'});

  // Initiate form datetimepickers
  var datepickerToggle = function(e, el){
    if (el)
      e.date = $(el).attr('data-datetime');
    if (e.date.valueOf() > new Date().valueOf()){         
      //find value of calendar in ever event        
      timeUpdate({ el: $(e.currentTarget), getset: false });

      var selected = {
        datetime: $(e.currentTarget).data('datetime'),
        datetimeLocal: $(e.currentTarget).val()
      };

      $(e.currentTarget)
        .data('datetime', selected.datetime)
        .val(moment(selected.datetimeLocal).format('MMMM Do YYYY, h:mm a'));
      toggleLabel(e, true);
  
    }
  };
  $('.form-datepicker').each(function(i , el){
    var thisTime = new Date().valueOf()
    $(el)
      .datetimepicker({
        startDate: new Date(),
        setEndDate: moment(new Date()).add(14, 'days'),
        showMeridian: true
      })
      .on('changeDate', function(e){
        var timerId = $(e.currentTarget).data('timerid');
        if (!isNaN(timerId)){
          clearTimer(timerId);
          $(e.currentTarget).removeData('timerid');
        }
        toggleLabel(e, true);
        $(el)
          .val(moment(e.date).format('MMMM Do YYYY, h:mm a'))
          .datetimepicker('hide');
      })
      .on('change', function(e){
        $(el).datetimepicker('hide');
      })
      .on('show', function(e){
        if ($(e.currentTarget).data('timerid')){
          var timerId = $(e.currentTarget).data('timerid');
          clearTimer(timerId);  
        }
      });
    
    timeUpdate({ el: el, getset: false });
  });

  // Initiate floating labels
  $('body').on('input propertychange', '.floating-label-form-group', function(e) {
    $(this).toggleClass('floating-label-form-group-with-value', !! $(e.target).val());
  }).on('focus', '.floating-label-form-group', function() {
    $(this).addClass('floating-label-form-group-with-focus');
  }).on('blur', '.floating-label-form-group', function() {
    $(this).removeClass('floating-label-form-group-with-focus');
  });

  // Set one way Session variable
  if ($('#oneway-toggle').is(':checked'))
    Session.set('oneway', true);
  else 
    Session.set('oneway', false);
};

Template.TripsCreate.destroyed = function () {

};