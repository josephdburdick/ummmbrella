/*****************************************************************************/
/* Client and Server Routes */
/*****************************************************************************/
Router.configure({
  layoutTemplate: 'MasterLayout',
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

Router.route('/', {name: 'trips.index'});


// Router.route('/trips/:_id', function(){
// 	var trip = Trips.findOne({_id: this.params_id })
// 	this.render('trips.create', {data: trip});
// });

Router.route('/trips/:_id', function () {
  this.render('TripsCreate', {
    data: function () {
      return Trips.findOne({_id: this.params._id});
    }
  });
});

Router.route('/new', function(){
	var tripId = Trips.insert({createdAt: Date.now()});
		// trip = Trips.findOne({_id: tripId })
	// this.render('TripsCreate', {data: trip});
	Router.go('/trips/'+ tripId);
});
















// Router.route('/create', {name: 'trips.create'});
// Router.route('/trips/:_id', function () {
//   var item = Items.findOne({_id: this.params._id});
//   this.render('trips.create', {data: item});
// });

// Router.route('/trips/:id', 
// {
// 	name: 'trips.create',
// 	waitOn: function() {
// 	return [
// 		    Meteor.subscribe('trips', this.params.id),
// 		    Meteor.subscribe('forecasts', this.params.id)
// 		]
// 	},
//     data: function() {
//         return {
//             trip: Trips.findOne({_id: this.params.id}),
//             forecasts: Forecasts.find({postId: this.params.id})
//         }
//      }
// });
