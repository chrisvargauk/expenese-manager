/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 15/04/2014
 * Time: 10:06
 */

console.log('VHeader is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!module/header/t-header.html',
  'module/nav/o-nav'
],
function ($, _, Backbone, Mustache,
          tmpl,
          oNav
  ) {

  var VHeader = Backbone.View.extend({
    initialize: function () {
      console.log('VHeader initialized');

      // Render Wrapper (or static structure)
      this.render();
      // Render internal elements (or dynamic elements)
      this.renderUpdate();

      pubsub.subscribe('header.startSlideIn', this.slideIn.bind(this));

      if (typeof this.model === 'undefined')
        return true;

      this.model.on('change', function (mExpense) {
        this.renderUpdate();
      }, this);
    },

    render: function () {
      var jqWrapper = $('<section data-id="header" class="header"></section>');
//      this.html = footerWrapper;
//      pubsub.publish('renderPage', {view: this});
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
        case 'icon-menu':
          console.log('icon-menu was tapped');
          this.toggleMenuIcon();
          break;

        case 'some-other-item':
          break;
      }
    },

    slideOut: function () {
      if (this.stateMenuIcon === 'on')
        return false;

      this.el.find('.icon-menu').addClass('active');
      this.stateMenuIcon = 'on';

    },

    slideIn: function () {
      if (this.stateMenuIcon === 'off')
        return false;

      this.el.find('.icon-menu').removeClass('active');
      this.stateMenuIcon = 'off';
    },

    toggleMenuIcon: function () {
      if (this.stateMenuIcon === 'off') {
        this.slideOut();
        oNav.view.startSlideIn();
      } else {
        this.slideIn();
        oNav.view.startSlideOut();
      }
    },

    stateMenuIcon: 'off'
  });

  return VHeader;
});