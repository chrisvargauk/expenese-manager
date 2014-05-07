/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 09/04/2014
 * Time: 10:01
 */

console.log('MNav is loaded.');

define(['jquery', 'underscore', 'backbone',
  'module/nav/r-page-manager'
  ], function($, _, Backbone,
  router
  ) {
  var MNav = Backbone.Model.extend({
    initialize: function () {
      console.log('MNav initialized');

      this.bind('change:hashComponentList', function(){
        console.log('*******************' + this.get('hashComponentList') + ' is now the value for name');
        this.generateNewHash();
      });

      pubsub.subscribe('nav.goToPage', this.goToPage.bind(this));

      window.router = router;
    },

    defaults: {
      hashComponentList: {},
      buttonList: [
        {
          id: 'this-week',
          label: 'This Week',
          action: function () {
            console.log('This Week btn');
            this.goToPage('this-week');
          }
        },
        {
          id: 'history',
          label: 'History',
          action: function () {
            console.log('History btn');
            this.goToPage('history');
          }
        },
        {
          id: 'setting',
          label: 'Settings',
          action: function () {
            console.log('Settings btn clicked');
            this.goToPage('setting');
          }
        }
      ]
    },

    goToPage: function (idPage) {
      router.setHashProp('page', idPage);
      pubsub.publish('navStartSlideOut');
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MNav;
});