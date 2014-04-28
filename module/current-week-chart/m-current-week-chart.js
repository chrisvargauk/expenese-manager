/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 26/03/2014
 * Time: 12:29
 */

console.log('MCurrentWeekChart is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var MCurrentWeekChart = Backbone.Model.extend({
    initialize: function () {
      console.log('MCurrentWeekChart initialized');

      pubsub.subscribe('expenseListUpdate', this.updateModel.bind(this));
    },

    defaults: {
      percentageDays: '0%',
      percentageMoney: '0%'
    },

    updateModel: function (evtName, data) {
      console.log(data);
      var expenseTotal = 0,
        targetedTotal = 200;

      data.forEach(function (expense) {
        expenseTotal += parseInt( expense.amount );
      });

      console.log('Total: ' + expenseTotal);

      var percentageMoney = expenseTotal / (targetedTotal / 100);

      if (percentageMoney > 100) {
        percentageMoney = 100;
      }

      console.log('percentageMoney: ' + percentageMoney);

      this.set('percentageMoney', percentageMoney + '%');

      var date = new Date();

      var percentageDays = date.getDay() / (7 / 100);

      this.set('percentageDays', percentageDays + '%');

    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
      json.cid = this.cid;
      return json;
    }
  });

  return MCurrentWeekChart;
});