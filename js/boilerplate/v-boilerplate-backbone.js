/**
 * Created with ${PRODUCT_NAME}.
 * User: ${USER}
 * Date: ${DATE}
 * Time: ${TIME}
 */

console.log('$ViewClassName is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!template/boilerplate-tmpl.html'
],
function ($, _, Backbone, Mustache,
          tmpl) {

  var $ViewClassName = Backbone.View.extend({
    initialize: function () {
      console.log('$ViewClassName initialized');

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
      var jqWrapper = $('<section data-id="$wrapper-data-id" class="$wrapper-data-id"></section>');
      jqWrapper.appendTo('body');
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

  return $ViewClassName;
});