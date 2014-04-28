/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 28/04/2014
 * Time: 15:01
 * To change this template use File | Settings | File Templates.
 */

define(['jquery'], function($) {
  var Router = function () {
    this.setting = {
      separator: '&',
      delimiter: '/'
    };

    this._init = function () {
      // Setup event listeners
      window.addEventListener('hashchange', this.handleHashChange.bind(this), false);
      pubsub.subscribe('router.setHashProp', this.setHashProp.bind(this));
      // Reg initial hash
      pubsub.subscribe('router.start', this.handleHashChange.bind(this));
    };

    this.model= (function () {
      var _data = {};

      var get = function (name) {
        return _data[name];
      };

      var set = function (name, value) {
        _data[name] = value;
        pubsub.publish('router.hashChange.' + name, {
          name: name,
          value: value
        });
        return this;
      }

      return {
        _data: _data,
        get: get,
        set: set
      }
    }());

    this.handleHashChange = function () {
      var hashToProcess = location.hash.replace('#', '');

      var hashItemList = hashToProcess.split(this.setting.separator);
      hashItemList.forEach(function (hashItem) {
        var hashItemPartList = hashItem.split(this.setting.delimiter),
            hashItemKey = hashItemPartList[0],
            hashItemValue = hashItemPartList[1];

        var hashItemCurrent = this.model.get(hashItemKey);

        if (typeof hashItemCurrent === 'undefined' || hashItemCurrent !== hashItemValue) {
          this.model.set(hashItemKey, hashItemValue);
        }
      }.bind(this));
    }

    this.setHashProp = function (evt, data) {
      Object.keys(data).forEach(function (key) {
        var value = data[key];
        this.model.set(key, value);
      }.bind(this));

      this.generateNewHash();
    }

    this.generateNewHash = function () {
      var hash = '#';
      var hashComponentList = this.model._data;
      $(Object.keys(hashComponentList)).each(function (index, key) {
        var value = hashComponentList[key];

        if (hash !== '#')
          hash += this.setting.separator;

        hash += key + this.setting.delimiter + value;
      }.bind(this));

      location.hash = hash;
    }

    this._init();
  };

  var router = new Router();
  window.router = router;

  // TODO: once loaded event is implemented, use it for handling "Backbone.history.start();" here.
  //Backbone.history.start();

  return router;
});