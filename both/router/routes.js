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
// var tripId;

Router.route('/', {name: 'trips.index'});
// Router.route('/trips/:_id', function(){
// 	var trip = Trips.findOne({_id: this.params_id })
// 	debugger;
// 	this.render('trips.create', {data: item});
// });
Router.route('/new', function(){
	var tripId = Trips.insert({createdAt: Date.now()}),
		trip = Trips.findOne({_id: tripId })
	this.render('TripsCreate', {data: trip});
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