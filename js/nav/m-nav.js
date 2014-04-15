/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 09/04/2014
 * Time: 10:01
 */

console.log('MNav is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var MNav = Backbone.Model.extend({
    initialize: function () {
      console.log('MNav initialized');
    },

    defaults: {
      buttonList: [
        {
          id: 'this-week',
          label: 'This Week',
          action: function () {
            console.log('This Week btn');
            pubsub.publish('navStartSlideOut');
            // pubsub.publish('showPage', {idPage: 'this-week'});
          }
        },
        {
          id: 'history',
          label: 'History',
          action: function () {
            console.log('History btn');
            pubsub.publish('navStartSlideOut');
            // pubsub.publish('showPage', {idPage: 'history'});
          }
        },
        {
          id: 'settings',
          label: 'Settings',
          action: function () {
            console.log('Settings btn');
            pubsub.publish('navStartSlideOut');
          }
        }
      ]
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MNav;
});