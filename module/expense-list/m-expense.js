console.log('m-expense.js is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var MExpense = Backbone.Model.extend({
    initialize: function () {
      console.log('MExpense initialized');
    },
    defaults: {
      category: 'unknown',
      amount: 'unknown',
      date: -1
    },
    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MExpense;
});