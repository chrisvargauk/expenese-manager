console.log('loaded: js/app.js');

define(['jquery',
        'underscore',
        'backbone',
        'mustache',

        'modal/v-modal',
        'modal/m-modal',

        'nav/v-nav',
        'nav/m-nav',

        'page-manager/v-page-manager',
        'page-manager/m-page-manager',

        'current-week-chart/v-current-week-chart',
        'current-week-chart/m-current-week-chart',

        'expense-list/v-expense-list',
        'expense-list/c-expense-list',

        'footer/vFooter',

        'history/v-history',

        'bootstrap',
        'lib/websql',
        'lib/pubsub-global'
  ], function( $,
               _,
               Backbone,
               Mustache,

               VModal,
               MModal,

               VNav,
               MNav,

               VPageManager,
               MPageManager,

               VCurrentWeekChart,
               MCurrentWeekChart,

               VExpenseList,
               CExpenseList,

               VFooter,

               VHistory
  ){
  var App = function () {
    console.log('App is instantiated.');

    var initWebSQL = function () {
      websql.createDatabase();

      websql.run([
        'CREATE TABLE IF NOT EXISTS expenselist (         ',
        '  id INTEGER PRIMARY KEY AUTOINCREMENT,          ',
        '  cid TEXT,                                      ',
        '  category TEXT,                                 ',
        '  amount TEXT,                                   ',
        '  date INTEGER                                   ',
        ')                                                '
      ].join(''));
    };

    var loadFromWebSQL = function () {
      websql.run('SELECT * FROM expenselist', function (item) {
        console.log(item)
        cExpenseList.add(
          {
            id: item.id,
            category: item.category,
            amount: item.amount
          }
        );
      });
    };

    // Init Modal Window
    var vModal = new VModal({
      model: new MModal()
    });

    // Init WebSQL
    initWebSQL();

    // Init Exoense List (Collection)
    var cExpenseList = new CExpenseList();

    // Load Saved Expenses
    loadFromWebSQL();

    var mCurrentWeekChart = new MCurrentWeekChart();

    // Init Nav
    var vNav = new VNav({
      model: new MNav()
    });

    var mPageManager = new MPageManager();
    var vPageManger = new VPageManager({
      model: mPageManager
    });

    vPageManger.regPage( 'this-week', function (idPage) {

      var vCurrentWeekChart = new VCurrentWeekChart({
        model: mCurrentWeekChart,
        idPage: idPage
      });

      // Init Expense List View
      var vExpenseList = new VExpenseList({
        model: cExpenseList,
        idPage: idPage
      });

      // Init Footer
      var vFooter = new VFooter({
        model: cExpenseList,
        idPage: idPage
      });
    });

    vPageManger.regPage( 'this-week2', function (idPage) {
      var vHistory = new VHistory({
        idPage: idPage
      });
    });

    vPageManger.loadPage('this-week');
    vPageManger.loadPage('this-week2');

    vPageManger.showPage('this-week')

    // TODO: remove when goes to production
    window._reveal = {
      cExpenseList: cExpenseList,
      mCurrentWeekChart: mCurrentWeekChart,
      vPageManger: vPageManger
    };

  };

  return App;
});