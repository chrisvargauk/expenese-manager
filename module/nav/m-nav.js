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

      this.bind('change:hashComponentList', function(){
        console.log('*******************' + this.get('hashComponentList') + ' is now the value for name');
        this.generateNewHash();
      });
    },

    defaults: {
      hashComponentList: {},
      buttonList: [
        {
          id: 'this-week',
          label: 'This Week',
          action: function () {
            console.log('This Week btn');
            pubsub.publish('navStartSlideOut');
            // pubsub.publish('showPage', {idPage: 'this-week'});

//            this.model.goToPage.call(this.model, 'this-week');
            pubsub.publish('router.setHashProp', {'page': 'this-week'});
          }
        },
        {
          id: 'history',
          label: 'History',
          action: function () {
            console.log('History btn');
            pubsub.publish('navStartSlideOut');
            // pubsub.publish('showPage', {idPage: 'history'});

//            this.model.goToPage.call(this.model, 'history');
            pubsub.publish('router.setHashProp', {'page': 'history'});
          }
        },
        {
          id: 'setting',
          label: 'Settings',
          action: function () {
            console.log('Settings btn clicked');
            pubsub.publish('navStartSlideOut');

//            this.model.goToPage.call(this.model, 'setting');
            pubsub.publish('router.setHashProp', {'page': 'setting'});
          }
        }
      ]
    },

    goToPage: function (idPage) {
      // TODO: This is a crap solution, I would be better of using native solution for model
      var hashComponentList = jQuery.extend(true, {}, this.get('hashComponentList'));
      hashComponentList['page'] = idPage;
      this.set('hashComponentList', hashComponentList);
    },

    generateNewHash: function () {
      console.log('this.generateNewHash() called');
//      var page = this.get('hashComponentList').page;
//      Backbone.history.navigate('#page/' + page);

      var hash = '#';
      var hashComponentList = this.get('hashComponentList');
      $(Object.keys(hashComponentList)).each(function (index, key) {
        var value = hashComponentList[key];
        hash += key + '/' + value + '&';
      });

      Backbone.history.navigate(hash);
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MNav;
});