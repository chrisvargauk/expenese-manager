/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 08/04/2014
 * Time: 12:17
 */

console.log('VHistory is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!boilerplate/boilerplate-tmpl.html'
],
function ($, _, Backbone, Mustache,
          tmpl) {

  var VHistory = Backbone.View.extend({
    initialize: function () {
      console.log('VHistory initialized');

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
      var jqWrapper = $('<div data-id="history" class="history"></div>');
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
    }
  });

  return VHistory;
});