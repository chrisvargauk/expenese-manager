/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 26/03/2014
 * Time: 11:52
 */

console.log('VCurrentWeekChart is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!current-week-chart/current-week-chart-tmpl.html'
],
  function ($, _, Backbone, Mustache,
            tmpl) {

    var VCurrentWeekChart = Backbone.View.extend({
      initialize: function () {
        console.log('VCurrentWeekChart initialized' + this.options.idPage);

        // Render Wrapper (or static structure)
        this.render();
        // Render internal elements (or dynamic elements)
        this.renderUpdate();

        if (typeof this.model === 'undefined')
          return true;

        this.model.on('change', function (mExpense) {
          this.renderUpdate();
        }, this);

        pubsub.subscribe('')
      },

      render: function () {
        var jqWrapper = $('<section data-id="current-week-chart" class="current-week-chart"></section>');
//      pubsub.publish('renderPage', {idPage: this.options.idPage, html: jqWrapper});
//      jqWrapper.appendTo('body');
        this.html = jqWrapper;
        pubsub.publish('renderPage', {view: this});

        this.el = jqWrapper;

        this.addEventListener();

        return this;
      },

      renderUpdate: function () {
//      var dataTmpl = {
//        percentageDays: '90%',
//        percentageMoney: '20%'
//      };

        var dataTmpl = this.model.toJSON();

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
      }
    });

    return VCurrentWeekChart;
  });