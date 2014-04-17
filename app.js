console.log('loaded: js/app.js');

define(['jquery',
        'underscore',
        'backbone',
        'mustache',

        'module/modal/v-modal',
        'module/modal/m-modal',

        'module/nav/v-nav',
        'module/nav/m-nav',

        'module/page-manager/v-page-manager',
        'module/page-manager/m-page-manager',
        'module/page-manager/r-page-manager',

        'module/header/v-header',

        'module/current-week-chart/v-current-week-chart',
        'module/current-week-chart/m-current-week-chart',

        'module/expense-list/v-expense-list',
        'module/expense-list/c-expense-list',

        'module/footer/v-footer',

        'module/horizontal-overview-chart/v-horizontal-bar-chart-overview',
        'module/horizontal-overview-chart/v-horizontal-overview-chart',
        'module/horizontal-overview-chart/m-horizontal-overview-chart',

        'module/setting-form/v-setting-form',

        'bootstrap',
        'js/lib/websql',
        'js/lib/pubsub-global',
        'js/lib/polyfill-get-week'
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
               RPageManager,

               VHeader,

               VCurrentWeekChart,
               MCurrentWeekChart,

               VExpenseList,
               CExpenseList,

               VFooter,

               VHorizontalBarChartOverview,
               VHorizontalOverviewChart,
               MHorizontalOverviewChart,

               VSettingForm
  ){
  var App = function () {
    console.log('App is instantiated.');

    // Init Modal Window
    var vModal = new VModal({
      model: new MModal()
    });

    var vHeader = new VHeader();

    // Init Exoense List (Collection)
    var cExpenseList = new CExpenseList();

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

    vPageManger.regPage( 'setting', function (idPage) {
      var vSettingForm = new VSettingForm({
        idPage: idPage
      });
    });

    // Load All Pages - in this context this makes sense
    vPageManger.loadPage('this-week');
    vPageManger.loadPage('history');
    vPageManger.loadPage('setting');

    // Select a page to start with
    vPageManger.showPage('this-week');

    // Init Nav
    var vNav = new VNav({
      model: new MNav()
    });

    Backbone.history.start();

    // TODO: remove when goes to production
    window._reveal = {
      cExpenseList: cExpenseList,
      vPageManger: vPageManger
    };

    // TODO: remove when goes to production
    window.resetWebSQL = cExpenseList.resetWebSQL;
  };

  return App;
});