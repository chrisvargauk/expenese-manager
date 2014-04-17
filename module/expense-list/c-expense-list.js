console.log('c-expense-list is loaded.');

define(['jquery', 'underscore', 'backbone',
        'module/expense-list/m-expense.js'],
  function($, _, Backbone,
           MExpense) {
  var CExpenseList = Backbone.Collection.extend({
    model: MExpense,

    initialize: function () {
      pubsub.subscribe('addExpense',    this.addExpense.bind(this)    );
      pubsub.subscribe('deleteExpense', this.deleteExpense.bind(this) );

      this.bind('add remove', this.publishNewExpenseList);

      this.createDatabaseIfNotExists( this.loadFromWebSQL.bind(this) );
    },

    addExpense: function (evtName, data) {
      data.date = Date.now();
      data.dayofweek = this.getDayChar( Date.now() );

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
    },

    createDatabaseIfNotExists: function (callbackDone) {
      websql.createDatabase();

      websql.run([
        'CREATE TABLE IF NOT EXISTS expenselist (         ',
        '  id INTEGER PRIMARY KEY AUTOINCREMENT,          ',
        '  cid TEXT,                                      ',
        '  category TEXT,                                 ',
        '  amount TEXT,                                   ',
        '  date INTEGER                                   ',
        ')                                                '
      ].join(''), undefined, callbackDone);
    },

    getDayChar: function ( timestamp ) {
      var dCurrent = new Date( timestamp ),
        ctrDayOfWeek = dCurrent.getDay(),
        dayOfWeek = '-';

      switch (ctrDayOfWeek) {
        case 1:
          dayOfWeek = 'M';
          break;
        case 2:
          dayOfWeek = 'T';
          break;
        case 3:
          dayOfWeek = 'W';
          break;
        case 4:
          dayOfWeek = 'T';
          break;
        case 5:
          dayOfWeek = 'F';
          break;
        case 6:
          dayOfWeek = 'S';
          break;
        case 7:
          dayOfWeek = 'S';
      };

      return dayOfWeek;
    },

    loadFromWebSQL: function () {
      var dNow = new Date(),
          dLastMidnight = new Date(dNow.getFullYear(), dNow.getMonth(), dNow.getDate()),
          dayOfWeek = dNow.getDay(),
          dMonday = new Date(dLastMidnight.getTime() - (dayOfWeek-1) * 1000 * 60 * 60 * 24),
          timestampMonday = dMonday.getTime();

      websql.run('SELECT * FROM expenselist WHERE date > ' + timestampMonday + ' ORDER BY date', function (expense) {
        this.add(
          {
            id: expense.id,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            dayofweek: this.getDayChar( expense.date )
          }
        );
      }.bind(this));
    }
  });

  return CExpenseList;
});