/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 04/04/2014
 * Time: 12:58
 */

console.log('MPageManager is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var MPageManager = Backbone.Model.extend({
    initialize: function () {
      console.log('MPageManager initialized');
    },
    defaults: {
      pages: [],
      pageContainers: [],
      idPageActive: 'none',
      ctrPageContainer: -1
    },
    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MPageManager;
});