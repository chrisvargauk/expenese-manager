/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 14/04/2014
 * Time: 10:19
 * To change this template use File | Settings | File Templates.
 */

console.log('MPageManager is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var Router = Backbone.Router.extend({
    routes: {
      '': 'pageHandlerDefaultPage',
      'page/:param': 'page_handler'
    },
    page_handler: function(idPage){
      pubsub.publish('showPage', {idPage: idPage});
    },
    pageHandlerDefaultPage: function () {
      pubsub.publish('showPage', {idPage: 'default'});
    }
  });

  var router = new Router();
  // TODO: once loaded event is implemented, use it for handling "Backbone.history.start();" here.
  //Backbone.history.start();

  return router;
});
