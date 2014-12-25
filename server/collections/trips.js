/*
 * Add query methods like this:
 *  Trips.findPublic = function () {
 *    return Trips.find({is_public: true});
 *  }
 */
 //WEATHER_UNDERGROUND_KEY: "ab9dbf6db769825d"
console.log('Weather U Key:' + process.env.WEATHER_UNDERGROUND_KEY);
Trips.allow({
  insert: function (userId, doc) {
    return true;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },

  remove: function (userId, doc) {
    return true;
  }
});

Trips.deny({
  insert: function (userId, doc) {
    return false;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function (userId, doc) {
    return false;
  }
});