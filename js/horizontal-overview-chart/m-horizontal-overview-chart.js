/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 10/04/2014
 * Time: 11:10
 */

console.log('MHorizontalOverviewChart is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var MHorizontalOverviewChart = Backbone.Model.extend({
    initialize: function () {
      console.log('MHorizontalOverviewChart initialized');
    },
    defaults: {
      monday: 10,
      tuesday: 20,
      wednesday: 30,
      thursday: 40,
      friday: 50,
      saturday: 60,
      sunday: 70
    },
    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MHorizontalOverviewChart;
});