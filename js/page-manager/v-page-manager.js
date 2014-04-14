/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 04/04/2014
 * Time: 12:26
 */

console.log('PageManager is loaded');

define(['jquery', 'underscore', 'backbone', 'mustache',
  'text!page-manager/page-manager-tmpl.html'
],
function ($, _, Backbone, Mustache,
          tmpl) {

  var PageManager = Backbone.View.extend({
    initialize: function () {
      console.log('PageManager initialized');

      // Render Wrapper (or static structure)
      this.render();

      pubsub.subscribe('renderPage', function (evtName, data) {
        this.renderPage(data.view);
      }.bind(this));

      pubsub.subscribe('showPage', function (evtName, data) {
        this.showPage(data.idPage)
      }.bind(this));

    },

    render: function () {
      var jqWrapper = $('<section data-id="page-manager" class="page-manager"></section>');
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
    },

    addPageContainer: function (idPage) {
      var jqPageContainer = $('<div class="page ' + idPage + '" data-id-page="' + idPage + '"></div>');
      this.el.append( jqPageContainer );

      return jqPageContainer;
    },

    regPage: function ( idPage, fn ) {
      var jqPageContainer = this.addPageContainer( idPage );

      var pages = this.model.get('pages');
      pages.push(
        {
          idPage: idPage,
          fn: fn,
          pageContainer: jqPageContainer
        }
      );
    },

    loadPage: function (idPage) {
      var pages = this.model.get('pages'),
          pageSelected = false;

      $(pages).each(function (key, page) {
        if (page.idPage === idPage) {
          pageSelected = page;
        }
      });

      if (!pageSelected)
        return false;

      pageSelected.fn(idPage);
    },

    getPage: function (idPage) {
      var pages = this.model.get('pages'),
        pageSelected = false;

      $(pages).each(function (key, page) {
        if (page.idPage === idPage) {
          pageSelected = page;
        }
      });

      if (!pageSelected)
        return false;

      return pageSelected;
    },

    renderPage: function (view) {
      var idPage = view.options.idPage;
      $('.page-manager [data-id-page="' + idPage + '"]').append( view.html );

      return idPage;
    },

    showPage: function (idPage) {
      var pageIncoming = this.getPage(idPage),
          idPageActive = this.model.get('idPageActive');

      // Do nothing if user whats to go to current page again
      if (idPageActive === idPage )
        return false;

      // If Page Manager loads the first page
      if (idPageActive === 'none' ) {
        pageIncoming.pageContainer.addClass('active');

        this.model.set('idPageActive', idPage);
      } else {
        var pageActive = this.getPage(idPageActive),
          pageIncoming = this.getPage(idPage);

        pageIncoming.pageContainer.addClass('incoming');
        pageActive.pageContainer.addClass('outgoing');

        // Make Incoming Page visible
        pageIncoming.pageContainer.addClass('active');

        var animate = function () {
          // Make Current Page slide out
          pageActive.pageContainer.addClass('animation');

          // Make Incoming Page slide in
          pageIncoming.pageContainer.addClass('animation');

          // Update Active Page in Model
          this.model.set('idPageActive', idPage);

          // Use 'webkitTransitionEnd' instead of the following
          setTimeout(clearArtifacts, 2000);
        }.bind(this);

        var clearArtifacts = function () {
          // Make Outgoing Page invisible
          this.hidePage(idPageActive);

          pageActive.pageContainer.removeClass('outgoing');
          pageIncoming.pageContainer.removeClass('incoming');
          pageActive.pageContainer.removeClass('animation');
          pageIncoming.pageContainer.removeClass('animation');
          pageActive.pageContainer.removeClass('active');
        }.bind(this);

        setTimeout(animate, 500);
      }
    },

    hidePage: function (idPage) {
      var page = this.getPage(idPage);
      page.pageContainer.removeClass('active');
    }
  });

  return PageManager;
});