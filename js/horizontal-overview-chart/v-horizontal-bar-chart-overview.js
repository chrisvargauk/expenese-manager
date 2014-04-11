/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 10/04/2014
 * Time: 14:05
 */

console.log('VHorizontalBarChartOverview is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!horizontal-overview-chart/t-horizontal-bar-chart-overview.html',
  'horizontal-overview-chart/v-horizontal-overview-chart',
  'horizontal-overview-chart/m-horizontal-overview-chart'
],
function ($, _, Backbone, Mustache,
          tmpl,
            VHorizontalOverviewChart,
          MHorizontalOverviewChart
  ) {

  var VHorizontalBarChartOverview = Backbone.View.extend({
    initialize: function () {
      console.log('VHorizontalBarChartOverview initialized');

      // Render Wrapper (or static structure)
      this.render();
      // Render internal elements (or dynamic elements)
      this.renderUpdate();

      this.loadWeekList();

      if (typeof this.model === 'undefined')
        return true;

      this.model.on('change', function (mExpense) {
        this.renderUpdate();
      }, this);
    },

    render: function () {
      var jqWrapper = $('<section data-id="horizontal-bar-chart-overview" class="horizontal-bar-chart-overview"></section>');

//      jqWrapper.appendTo('body');
      this.html = jqWrapper;
      pubsub.publish('renderPage', {view: this});

      this.el = jqWrapper;


      this.addEventListener();

      return this;
    },

    renderUpdate: function () {
      var dataTmpl = {
        wrd: 'world'
      };

      var compTmpl = Mustache.render(tmpl, dataTmpl);

      // Simplified update method for now
      this.el.html( compTmpl );

      return this;
    },

    addEventListener: function () {
      var view = this;

      this.el.addEvt('tap', function (evt) {
        var evtType = this.Tap.evtType,
          target = evt.target;

        view.handleDomEvent(evtType, target, evt);
      });
    },

    handleDomEvent: function (evtType, target, evtOriginal) {
      console.log('Handle Evt: ' + evtType);

      // Suggested approach to check what was tapped
      switch ( $(target).data('id') ) {
        case 'boilerplate-item':
          console.log('boilerplate-item was tapped');
          break;

        case 'some-other-item':
          break;
      }
    },

    loadWeekList: function () {
      var createWeek = function () {
        var week = Object.create(null);

        week.monday = 0;
        week.tuesday = 0;
        week.wednesday = 0;
        week.thursday = 0;
        week.friday = 0;
        week.saturday = 0;
        week.sunday = 0;
        week.total = 0;

        return week;
      };

      var processDayList = function () {
        var ctrDayPrev = -1,
          dayListProcessed = [];

        $(dayList).each(function (key, day) {
          var d = new Date(day.date),
            ctrDayCurrent = d.getDay();

          if (ctrDayPrev !== ctrDayCurrent) {
            dayListProcessed.push({
              date: day.date,
              amount: parseInt(day.amount),
              category: day.category,
              ctrDay: ctrDayCurrent,
              ctrWeek: d.getWeek()
            });
          } else {
            var lastIndex = dayListProcessed.length - 1,
              dayProcessedPrev = dayListProcessed[lastIndex];

            dayProcessedPrev.amount += parseInt(day.amount);
            dayProcessedPrev.category = 'merged';
          }

          ctrDayPrev = ctrDayCurrent;
        });

        dayList = dayListProcessed;

        createChartList();
      };

      var createChartList = function () {
        var ctrWeekPrev = -1;

        var createChart = function () {
          // Turn Amounts to Percentages
          if (typeof week === 'undefined')
            return false;

          $(Object.keys(week)).each(function(index, key) {
            week[key+'Percent'] = Math.floor(week[key] / (week.total/100));
          });

          console.log(week);
          var mHorizontalOverviewChart = new MHorizontalOverviewChart(week);
          var vHorizontalOverviewChart = new VHorizontalOverviewChart({
            model: mHorizontalOverviewChart,
            jqRenderTarget: this.html,
            idPage: this.options.idPage
          });
        }.bind(this);

        $(dayList).each(function (key, day) {
          console.log(day);

          if (ctrWeekPrev !== day.ctrWeek) {
            if (ctrWeekPrev !== -1) {
              createChart();
            }

            week = createWeek();
          }

          switch (day.ctrDay) {
            case 1:
              week.monday = day.amount;
              break;
            case 2:
              week.tuesday = day.amount;
              break;
            case 3:
              week.wednesday = day.amount;
              break;
            case 4:
              week.thursday = day.amount;
              break;
            case 5:
              week.friday = day.amount;
              break;
            case 6:
              week.saturday = day.amount;
              break;
            case 7:
              week.sunday = day.amount;
          };

          week.total += day.amount;

          ctrWeekPrev = day.ctrWeek;
        });

        createChart();
      }.bind(this);

      var dayList = [],
        week;
      websql.run('SELECT * FROM expenselist', function (day) {
        console.log(day);
        dayList.push( day );
      }, processDayList);
    }
  });

  return VHorizontalBarChartOverview;
});