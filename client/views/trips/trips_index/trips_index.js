/*****************************************************************************/
/* TripsIndex: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.TripsIndex.events({
	/*
	 * Example:
	 *  'click .selector': function (e, tmpl) {
	 *
	 *  }
	 */
});

Template.TripsIndex.helpers({
	/*
	 * Example:
	 *  items: function () {
	 *    return Items.find();
	 *  }
	 */
	forecast: function() {
		Meteor.call('getForecast', "VA/Richmond", function(error, results){
			Session.set('weather', results.content);
		});
		return (Session.get('weather'));
	}


});

/*****************************************************************************/
/* TripsIndex: Lifecycle Hooks */
/*****************************************************************************/
Template.TripsIndex.created = function () {
};

Template.TripsIndex.rendered = function () {
};

Template.TripsIndex.destroyed = function () {
};