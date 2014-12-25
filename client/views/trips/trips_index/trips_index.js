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
			var weather = Meteor.call("getForecast", function(error, result){
				if (error){
					return error;
				}	else {
					return result;
				}
			});
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