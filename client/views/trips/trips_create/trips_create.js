/*****************************************************************************/
/* TripsCreate: Event Handlers and Helpers .js*/
/*****************************************************************************/

var timeUpdate = function(options){
  var id = $(options.el).attr('data-timerid');
  console.log (options);
  if (id && options.getset === false){
    clearTimer(id);
  } else if (options.el && options.getset === true){
    if (!$(options.el).attr('data-timerid')){
      var timerId = setInterval(function(){        
        $(options.el).val(Session.get('currentDatetime'));    
      }, 1000);
      $(options.el).attr('data-timerid', timerId)  
    }    
  }
  // if (options.getset === true){  
  //   // timerId = Meteor.setInterval(function(){
  //   //   Session.set("tomorrowsDatetime", moment().add(1, 'days').calendar());
  //   //   Session.set("tomorrowsDatetimeLocal", moment().add(1, 'days').format('MMMM Do YYYY, h:mm:ss a'));
  //   // }, 1000 );
  //   if (options.el)
  //     $(options.el).attr('data-timerId', timerId);
  //   console.log('timerId starting:', timerId);
  // } else {
  //   if (isNaN(timerId))
  //     timerId = $(options.el).attr('data-timerId');
  //   console.log('timerId stopping:', timerId);
  //   clearTimer(timerId);
  // } 
  return id; 
};

// Clear Timers
var clearTimer = function(id){
  window.clearInterval(id);
  Meteor.clearInterval(id);
};

// Toggle Floating Label
var toggleLabel = function (e, toggle){
  if (toggle === true){
    $(e.currentTarget)
    .closest('.input-group')
      .find('input.form-control')
      .focus()
    .closest('.input-group')
      .addClass('floating-label-form-group-with-value');
  } else if (toggle === false){
    $(e.currentTarget)
    .closest('.input-group')
      .find('input.form-control')
      .blur()
    .closest('.input-group')
      .removeClass('floating-label-form-group-with-value');
  }
}
var timersArray = [];
Template.TripsCreate.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
    'click #origin-departureDate':function(e, template){
      // debugger;
    },
    'click #trip-getDepartureDatetime': function(e, template){
      e.preventDefault();
      var datetimeInput = $(e.currentTarget).closest('.input-group').find('.form-datepicker')
      bootbox.dialog({
        message: "Are you leaving now or later?",
        title: "Choose Option",
        buttons: {
          success: {
            label: "Leaving Now",
            className: "btn-success",
            callback: function() {
              // var timerId = timeUpdate({
              //   el: datetimeInput,
              //   getset: true
              // });
              // var timerId = 
              
              // var thisId = setInterval(function(){
              //   datetimeInput.val(Session.get('currentDatetime'));
              //   // datetimeInput.val(moment().calendar());
              // }, 1000);

              timeUpdate({
                el: $(datetimeInput[0]),
                getset: true
              });

              // timeUpdate({
              //   el: $(e.currentTarget),
              //   getset: true
              // });
              // timeUpdate({
              //   el: datetimeInput,
              //   getset: true
              // });

              // timersArray.push([{
              //   id: thisId,
              //   el: datetimeInput
              // }]);
              datetimeInput.datetimepicker('hide');
            }
          },
          
          main: {
            label: "Leaving Later",
            className: "btn-primary",
            callback: function() {
              datetimeInput.datetimepicker('show');
            }
          }
        }
      });      
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
              .val(Session.get('tomorrowsDatetime'));
            toggleLabel(e, true);
        }  
      });
    },

    'keyup input': function (e, template) {
      Session.set('origin-location', $('#origin-location').val());
      Session.set('destination-location', $('#destination-location').val());

      if ($(e.currentTarget).closest('.input-group').hasClass('floating-label-form-group')){       
        $(e.currentTarget).val() ? toggleLabel(e, true) : toggleLabel(e, false);
      }
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
  leavingDatetime: function(options){
    if (Session.get('leavingDatetime'))
      return Session.get('leavingDatetime');
    else
      return Session.get('tomorrowsDatetimeLocal');
  },
  currentDatetime: function(){
    return Session.get('currentDatetime');
  },
  currentDatetimeLocal: function(){
    return Session.get('currentDatetimeLocal');
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
      timeUpdate({
        el: $(e.currentTarget),
        getset: false
      });

      var selected = {
        datetime: $(e.currentTarget).data('datetime'),
        datetimeLocal: $(e.currentTarget).val()
      };

      $(e.currentTarget)
        .data('datetime', selected.datetime)
        .val(moment(selected.datetimeLocal).format('MMMM Do YYYY, h:mm a'))
        .closest('.input-group').addClass('floating-label-form-group-with-value');
    }
  };
  $('.form-datepicker').each(function(i , el){
    var thisTime = new Date().valueOf()
    $(el).datetimepicker({
      startDate: new Date(),
      showMeridian: true
    }).on('changeDate', function(e){
      
      var timerId = $(e.currentTarget).data('timerid');
      if (!isNaN(timerId)){
        clearTimer(timerId);
        $(e.currentTarget).removeData('timerid');
      }
      toggleLabel(e, true);
      $(el).datetimepicker('hide');
    }).on('change', function(e){
      console.log(e);
      if (e.currentTarget.value)
        toggleLabel(e, true);
      else
        toggleLabel(e, false);
      $(el).datetimepicker('hide');
    }).on('show', function(e){
      if ($(e.currentTarget).data('timerid')){
        var timerId = $(e.currentTarget).data('timerid');
        clearTimer(timerId);  
      }
    });
    timeUpdate({
      el: el,
      getset: false
    });;
  });

  // Initiate floating labels
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