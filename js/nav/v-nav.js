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

      pubsub.subscribe('navOn', this.navOn.bind(this));
      pubsub.subscribe('navOff', this.navOff.bind(this));
      pubsub.subscribe('navToggle', this.navToggle.bind(this));

      // Activate Nav if user taps on header
      $('header').addEvt('tap', this.navToggle.bind(this));
      $('.current-week-chart').addEvt('tap', this.toggleSwipe.bind(this));

      this.domRef.jqDragTarget = $('.page-manager');
      this.domRef.jqDragTarget.addEvt('drag', this.handleDragEvt.bind(this));
      this.domRef.jqDragTarget.addEvt('release', this.handleRelease.bind(this));
      // Fix Adroid bug - and make the whole nav a lot more difficult
      this.domRef.jqDragTarget.on('touchstart', function (evt) {
        if (this.swipe === 'on') {
          // This make mousemove to be triggered continuously if you move your finger on the screen. (and disables 'overflow: scroll' :( )
          evt.preventDefault();
        }
      }.bind(this));

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

      this.navOff();
    },

    handleDragEvt: function (evt) {
      var xDiff = this.domRef.jqDragTarget[0].Tap.DragDetails.xDiff;
      var yDiff = this.domRef.jqDragTarget[0].Tap.DragDetails.yDiff;

      if ( Math.abs(xDiff) > Math.abs(yDiff) ) {
        this.handleSwipeEvent(evt, xDiff);
      }  else {
        this.handleScrollEvent(evt, yDiff);
      }
    },

    handleSwipeEvent: function (evt, xDiff) {
      this.xDiffTotal += xDiff;
      console.log('xDiffTotal: ' + this.xDiffTotal);
      if (this.xDiffTotal > 20) {
        this.navOn();
        this.xDiffTotal = 0;
      }
    },

    handleScrollEvent: function (evt, yDiff) {
//      // Avoid beeing triggerd twice because user drags twice as long as necessary
//      if (this.state !== 'off')
//        return false;

      if (this.swipe === 'on') {
        if (typeof this.domRef.jqScrollContainer === 'undefined') {
          this.domRef.jqScrollContainer = this.domRef.jqDragTarget.find('.container');
        }

        this.scrollTop += yDiff * 1.5;

        // If user scrolls to high up
        if (this.scrollTop > 0 ) {
          this.scrollTop = 0;
          return false;
        }

//        this.domRef.jqDragTarget.find('.container').css('-webkit-transform', 'translate(0, '+this.scrollTop+'px)');
        this.domRef.jqScrollContainer.css('-webkit-transform', 'translate(0, '+this.scrollTop+'px)');
        console.log('this.scrollTop: ' + this.scrollTop);
      }
    },

    handleRelease: function (evt) {
      // Avoid swipes being add up
      this.xDiffTotal = 0;
    },

    navOn: function () {
      console.log('Loading');

      this.state = 'loading';
      this.domRef.el.addClass('enabled');

      // Give a change for the animation to kick in
      setTimeout(function () {
        this.domRef.el.addClass('on');
        this.domRef.jqNav.addClass('on');
      }.bind(this), 10);
    },

    navOff: function () {
      console.log('Quiting');

      this.state = 'quiting';
      this.domRef.el.removeClass('on');
      this.domRef.jqNav.removeClass('on');

      this.safetyTransitionEndTimer = setTimeout(function () {
        console.log('safetyTransitionEndTimer kicked in - off');
        this.state = 'off';
        this.domRef.el.removeClass('enabled');
      }.bind(this), 1000);
    },

    state: 'off',

    navToggle: function () {
      if (this.state === 'on') {
        this.navOff();
      } else {
        this.navOn();
      }
    },

    transitionEnd: function (evt) {
      console.log("CSS Property completed, this.state = " + this.state);

      if (this.state === 'loading') {
        console.log('on');
        this.state = 'on';
      } else if (this.state === 'quiting') {
        console.log('off');
        this.state = 'off';
        this.domRef.el.removeClass('enabled');

        clearTimeout( this.safetyTransitionEndTimer );
      }
    },

    toggleSwipe: function () {
      console.log('toggleSwipe');

      if (this.swipe === 'on') {
        this.swipe = 'off';
      } else {
        this.swipe = 'on';
      }
    },

    xDiffTotal: 0,
    scrollTop: 0,
    swipe: 'off'
  });

  return VNav;
});