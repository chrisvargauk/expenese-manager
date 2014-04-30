/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 16/04/2014
 * Time: 11:39
 */

console.log('VSettingForm is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!module/setting-form/t-setting-form.html'
],
function ($, _, Backbone, Mustache,
          tmpl) {

  var VSettingForm = Backbone.View.extend({
    initialize: function () {
      console.log('VSettingForm initialized');

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
      var jqWrapper = $('<section data-id="setting-form" class="setting-form"></section>');
      this.html = jqWrapper;
      pubsub.publish('renderPage', {view: this});
//      jqWrapper.appendTo('body');
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
        case 'btn-reset-data':
          console.log('btn-reset-data was tapped');
          this.resetData();
          break;

        case 'btn-add-random-data':
          console.log('btn-add-random-data');
          this.addRandomData();
          break;

        case 'some-other-item':
          break;
      }
    },

    resetData: function () {
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
    },

    addRandomData: function () {
      resetWebSQL();
    }
  });

  return VSettingForm;
});