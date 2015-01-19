/*****************************************************************************/
/* Client and Server Routes */
/*****************************************************************************/
Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

/*
 *  Example:
 *  Router.route('/', {name: 'home'});
*/
Router.route('/', {name: 'trips.index'});

// Router.route('/create', {name: 'trips.create'});
// Router.route('/trips/:_id', function () {
//   var item = Items.findOne({_id: this.params._id});
//   this.render('trips.create', {data: item});
// });

Router.map(function () {  
  this.route('trips/:id', {
      waitOn: function() {
        return [
            Meteor.subscribe('trips', this.params.id),
            Meteor.subscribe('forecasts', this.params.id)
        ]
      },

      data: function() {
        return {
            trip: Trips.findOne({_id: this.params.id}),
            forecasts: Forecasts.find({postId: this.params.id})
        }
      }
  });
});Router.route('/', {name: 'forecasts.index'});
