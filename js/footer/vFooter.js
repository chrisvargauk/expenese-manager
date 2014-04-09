define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!footer/footer-tmpl.html',
  'js/expense-list/m-expense.js',

  'tap',
  'lib/websql'
],
  function ($, _, Backbone, Mustache,
            footerTmpl,
            MExpense
    ) {

    var VFooter = Backbone.View.extend({
      initialize: function () {
        console.log('footer initialized');

        this.render();

        this.regDomRef();
        this.addEventListener();
      },

      render: function () {
        var tempCompiled = Mustache.render(footerTmpl),
            footerWrapper = $(tempCompiled);

//        document.body.insertAdjacentHTML('beforeend', outputFooter);
        this.html = footerWrapper;
        pubsub.publish('renderPage', {view: this});
      },

      regDomRef: function () {
        this.dom = {
          $el: $('footer'),
          $btnAdd: $('footer .btn.add'),
          $inputCategory: $('footer .category'),
          $inputAmount: $('footer .amount')
        }
      },

      addEventListener: function () {
        this.dom.$btnAdd.addEvt('tap', function (evt) {
          console.log('tap');

          pubsub.publish('addExpense', {
            category: this.dom.$inputCategory.val(),
            amount: this.dom.$inputAmount.val(),
            date: Date.now()
          });
        }.bind(this));
      }
    });

    return VFooter;
  });