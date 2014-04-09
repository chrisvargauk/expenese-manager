/**
 * Created with ${PRODUCT_NAME}.
 * User: ${USER}
 * Date: ${DATE}
 * Time: ${TIME}
 */

console.log('$ModelName is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var $ModelName = Backbone.Model.extend({
    initialize: function () {
      console.log('$ModelName initialized');
    },

    defaults: {},

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return $ModelName;
});
