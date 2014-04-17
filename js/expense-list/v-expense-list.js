define(['jquery', 'underscore', 'backbone', 'mustache',
        'text!expense-list/t-expense-list.html',
        'scrollable'
],
function ($, _, Backbone, Mustache,
          summarySectionTmpl) {

  var VExpenseList = Backbone.View.extend({
    el: $('section.summary'),

    initialize: function () {
      console.log('summarySectionView initialized'+this.options.idPage);

      this.render();

      // Run renderUpdate to render the basics if WebSQL is empty
      this.renderUpdate();

      this.model.on('add remove', function (mExpense) {
        this.renderUpdate();
      }, this);
    },

    render: function () {
      var jqWrapper = '<section class="summary" id="summary-wrapper"></section>';
//      document.body.insertAdjacentHTML('beforeend', summaryWrapper);
//      pubsub.publish('renderPage', {idPage: 0, html: summaryWrapper});
      this.html = jqWrapper;
      pubsub.publish('renderPage', {view: this});

      this.regDomRef();
      this.addEventListener();
    },

    renderUpdate: function () {
      var listExpense = this.model.toJSON();

      var total = 0;
      listExpense.forEach(function (expense) {
        total += parseFloat(expense.amount);
      });

      var dataRows = {
        rows: listExpense,
        total: total
      }

      var outputSummary = Mustache.render(summarySectionTmpl, dataRows);
      this.dom.$summaryWrapper.html( outputSummary );

      return this;
    },

    regDomRef: function () {
      this.dom = {
        $summaryWrapper: $('#summary-wrapper')
      }
    },

    addEventListener: function () {
      this.dom.$summaryWrapper.addEvt('tap', function (evt) {
        console.log('List item: ' + $(evt.target).data('id'));
        var id = $(evt.target).data('id');
        var cid = $(evt.target).data('cid');
        pubsub.publish('expenseListItemTaped', {cid: cid});
      });
    }
  });

  return VExpenseList;
});