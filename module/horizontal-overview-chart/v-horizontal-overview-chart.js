/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 10/04/2014
 * Time: 09:42
 */

console.log('VHorizontalOverviewChart is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!module/horizontal-overview-chart/t-horizontal-overview-chart.html'
],
function ($, _, Backbone, Mustache,
          tmpl) {

  var VHorizontalOverviewChart = Backbone.View.extend({
    initialize: function () {
      console.log('VHorizontalOverviewChart initialized');

      // Render Wrapper (or static structure)
      this.render();
      // Render internal elements (or dynamic elements)
      this.renderUpdate();

      if (typeof this.model === 'undefined')
        return true;

      this.model.on('change', function (mExpense) {
        this.renderUpdate();
      }, this);
    },

    render: function () {
      var jqWrapper = $('<div data-id="horizontal-overview-chart" class="horizontal-overview-chart"></div>');
//      jqWrapper.appendTo('body');
      this.el = jqWrapper;

      if (typeof this.options.jqRenderTarget === 'undefined') {
        this.html = jqWrapper;
        pubsub.publish('renderPage', {view: this});
      } else {
        this.options.jqRenderTarget.append(jqWrapper);
      }

      this.lockWidth();

      this.addEventListener();

      return this;
    },

    renderUpdate: function () {
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
    },

    lockWidth: function () {
      this.el[0].style.width = window.innerWidth + 'px';
    }
  });

  return VHorizontalOverviewChart;
});