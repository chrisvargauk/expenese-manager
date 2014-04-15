/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 02/04/2014
 * Time: 16:16
 */

console.log('nav is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!nav/nav-tmpl.html'
],
function ($, _, Backbone, Mustache,
          tmpl) {

  var VNav = Backbone.View.extend({
    initialize: function () {
      console.log('nav initialized');

      this.domRef = {};

      // Render Wrapper (or static structure)
      this.render();
      // Render internal elements (or dynamic elements)
      this.renderUpdate();

      this.domRef.jqNav = this.domRef.el.find('nav');

      pubsub.subscribe('startSlideIn', this.startSlideIn.bind(this));
      pubsub.subscribe('startSlideOut', this.startSlideOut.bind(this));
      pubsub.subscribe('toggleNav', this.toggleNav.bind(this));

      // Activate Nav if user taps on header
      // Todo: Replace this with pubsub event triggerd from header
      $('header').addEvt('tap', this.toggleNav.bind(this));

      this.domRef.el.on('webkitTransitionEnd', this.transitionEnd.bind(this));

      if (typeof this.model === 'undefined')
        return true;

      this.model.on('change', function (mExpense) {
        this.renderUpdate();
      }, this);
    },

    render: function () {
      var jqWrapper = $('<section data-id="nav" class="nav bg"></section>');
      jqWrapper.appendTo('body');
      this.domRef.el = jqWrapper;

      this.addEventListener();

      return this;
    },

    renderUpdate: function () {
      var buttonList = this.model.get('buttonList'),
          dataTmpl = {
            buttonList: buttonList
          };

      var compTmpl = Mustache.render(tmpl, dataTmpl);

      // Simplified update method for now
      this.domRef.el.html( compTmpl );

      return this;
    },

    addEventListener: function () {
      var view = this;

      this.domRef.el.addEvt('tap', function (evt) {
        var evtType = this.Tap.evtType,
          target = evt.target;

        view.handleDomEvent(evtType, target, evt);
      });
    },

    handleDomEvent: function (evtType, target, evtOriginal) {
      console.log('Handle Evt: ' + evtType);

      var buttonList = this.model.get('buttonList');
      $(buttonList).each(function (key, button) {
        if ($(target).data('id') !== button.id)
          return;

        button.action();
      }.bind(this));

      this.startSlideOut();
    },

    startSlideIn: function () {
      this.state = 'slidingIn';
      this.domRef.el.addClass('enabled');

      // Give a change for the animation to kick in
      setTimeout(function () {
        this.domRef.el.addClass('on');
        this.domRef.jqNav.addClass('on');
      }.bind(this), 10);
    },

    finishSlideIn: function () {
      this.state = 'on';
    },

    startSlideOut: function () {
      this.state = 'slidingOut';
      this.domRef.el.removeClass('on');
      this.domRef.jqNav.removeClass('on');

      // Clean up if animation gets canceled or fails
      this.safetyTransitionEndTimer = setTimeout(function () {
        console.log('safetyTransitionEndTimer kicked in - off');
        this.state = 'off';
        this.domRef.el.removeClass('enabled');
      }.bind(this), 1000);
    },

    finishSlideOut: function () {
      this.state = 'off';
      this.domRef.el.removeClass('enabled');

      clearTimeout( this.safetyTransitionEndTimer );
    },

    toggleNav: function () {
      if (this.state === 'on') {
        this.startSlideOut();
      } else if (this.state === 'off') {
        this.startSlideIn();
      }
    },

    transitionEnd: function (evt) {
      if (this.state === 'slidingIn') {
        this.finishSlideIn();
      } else if (this.state === 'slidingOut') {
        this.finishSlideOut();
      }
    },

    state: 'off'
  });

  return VNav;
});