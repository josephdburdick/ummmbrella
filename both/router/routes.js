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

Router.route('/create', {name: 'trips.create'});

// Router.route('/create', function () {
//   this.render('trips_create');
// });