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

        'footer/v-footer',

        'horizontal-overview-chart/v-horizontal-bar-chart-overview',
        'horizontal-overview-chart/v-horizontal-overview-chart',
        'horizontal-overview-chart/m-horizontal-overview-chart',

        'bootstrap',
        'lib/websql',
        'lib/pubsub-global',
        'lib/polyfill-get-week'
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

               VHorizontalBarChartOverview,
               VHorizontalOverviewChart,
               MHorizontalOverviewChart
  ){
  var App = function () {
    console.log('App is instantiated.');

    var resetWebSQL = function () {
      websql.deleteTable('expenselist');

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

      var getRandomArbitrary = function(min, max) {
        return Math.random() * (max - min) + min;
      }

      var categoryList = ['Hazev', 'TESCO', 'Brera', 'Car', 'Gym', 'GooglePlay'];

      var decrementByNumDay = 0;
      for(var i= 0; i<50; i++) {
        decrementByNumDay += Math.round(Math.random(0, 1));

        var dateCurrent = Date.now() - decrementByNumDay * 1000 * 60 * 60 * 24;
        var categoryListIndex = Math.round(getRandomArbitrary(0, (categoryList.length-1)));
        console.log(categoryListIndex);
        var expense = {
          category: categoryList[categoryListIndex],
          amount: Math.round(Math.random() / 3 * 100),
          date: dateCurrent
        }
        pubsub.publish('addExpense', expense);
      };
    };

    // Init Modal Window
    var vModal = new VModal({
      model: new MModal()
    });

    // Init Exoense List (Collection)
    var cExpenseList = new CExpenseList();

    // Init Nav
    var vNav = new VNav({
      model: new MNav()
    });


    // Init Page Manager
    var mPageManager = new MPageManager();
    var vPageManger = new VPageManager({
      model: mPageManager
    });

    // Reg This Week page components
    vPageManger.regPage( 'this-week', function (idPage) {
      //  Load Current Week Chart
      var mCurrentWeekChart = new MCurrentWeekChart();
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

    // Reg History page components
    vPageManger.regPage( 'history', function (idPage) {
      // Init Horizontal Bar Charts
      var vHorizontalBarChartOverview = new VHorizontalBarChartOverview({
        idPage: idPage
      });
    });

    // Load All Pages - in this context this makes sense
    vPageManger.loadPage('this-week');
    vPageManger.loadPage('history');

    // Select a page to start with
    vPageManger.showPage('this-week')

    // TODO: remove when goes to production
    window._reveal = {
      cExpenseList: cExpenseList,
      vPageManger: vPageManger
    };

    // TODO: remove when goes to production
    window.resetWebSQL = resetWebSQL;
  };

  return App;
});