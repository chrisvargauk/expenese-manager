console.log('m-modal.js is loaded.');

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var MModal = Backbone.Model.extend({
    initialize: function () {
      console.log('MModal initialized');

      pubsub.subscribe('expenseListItemTaped', this.updateModel.bind(this));
    },
    defaults: {
      itemCid: 'unknown'
    },
    updateModel: function (evtName, data) {
      console.log('MModal response:' + data.cid);
      this.set('itemCid', data.cid);
    }
  });

  return MModal;
});