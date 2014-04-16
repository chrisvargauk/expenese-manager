define(['jquery', 'underscore', 'backbone', 'mustache',
        'text!modal/t-modal.html'
  ],
  function ($, _, Backbone, Mustache,
            modalTmpl) {

  var VModal = Backbone.View.extend({
    initialize: function () {
      console.log('Init modal');

      this.render();

      pubsub.subscribe('expenseListItemTaped', this.show.bind(this));

      this.model.on('change', this.renderUpdate.bind(this));
    },

    render: function () {
      var modalWrapper = '<dialog id="modal-wrapper"></dialog>';
      document.body.insertAdjacentHTML('beforeend', modalWrapper);
      this.el = $('#modal-wrapper');
      this.renderUpdate();
      dialogPolyfill.updateReg();
    },

    renderUpdate: function () {
      console.log('render update on VModal' + this.model.get('itemId'));

      var tmplData = this.model.toJSON();
      var tmplComp = Mustache.render(modalTmpl, tmplData);

      this.el.html( tmplComp );

      this.regDomRef();
      this.addEventListener();
    },

    regDomRef: function () {
      this.dom = {
        // Use querySelector instead of jquery to avoid the showModal method being deleted.
        modalWrapper: document.querySelector('dialog#modal-wrapper'),
        $btnYes: $('dialog#modal-wrapper button.yes'),
        $btnNo: $('dialog#modal-wrapper button.no')
      }
    },

    addEventListener: function () {
      this.dom.$btnYes.addEvt('tap', function (evt) {
        console.log('Yes');

        var itemCid = this.model.get('itemCid');
        pubsub.publish('deleteExpense', {cid: itemCid});
        this.dom.modalWrapper.close();
      }.bind(this));

      this.dom.$btnNo.addEvt('tap', function (evt) {
        console.log('No');

        this.dom.modalWrapper.close();
      }.bind(this));
    },

    show: function () {
      this.dom.modalWrapper.showModal();
    },

    close: function () {
      this.dom.modalWrapper.close();
    }
  });

  return VModal;
});