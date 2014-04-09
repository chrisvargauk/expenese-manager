console.log('c-expense-list is loaded.');

define(['jquery', 'underscore', 'backbone',
        'js/expense-list/m-expense.js'],
  function($, _, Backbone,
           MExpense) {
  var CExpenseList = Backbone.Collection.extend({
    model: MExpense,

    initialize: function () {
      pubsub.subscribe('addExpense',    this.addExpense.bind(this)    );
      pubsub.subscribe('deleteExpense', this.deleteExpense.bind(this) );

      this.bind('add remove', this.publishNewExpenseList);
    },

    addExpense: function (evtName, data) {
      var mExpense = new MExpense(data);
      this.add( mExpense );

      this.addExpenseToWebSQL( mExpense );
    },

    addExpenseToWebSQL: function (mExpense) {
      websql.run([
        'INSERT INTO expenselist (cid, category, amount, date) ',
        'VALUES ("' + mExpense.cid + '", "' + mExpense.get('category') + '", "' + mExpense.get('amount') + '", ' + mExpense.get('date') + ')'
      ].join(''));
    },

    deleteExpense: function (evtName, data) {
      console.log('deleteExpense() called');
      var mExpense = this.get( data.cid );
      this.remove( mExpense );

      this.deleteExpenseFromWebSQL( mExpense.get('id') );
    },

    deleteExpenseFromWebSQL: function (id) {
      websql.run("DELETE FROM expenselist WHERE id="+id);
    },

    publishNewExpenseList: function () {
      pubsub.publish('expenseListUpdate', this.toJSON());
    }
  });

  return CExpenseList;
});