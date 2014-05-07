/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 28/04/2014
 * Time: 15:01
 * To change this template use File | Settings | File Templates.
 */

define(['jquery'], function($) {
  return new function () {
    // Settings
    this.setting = {
      separator: '&',
      delimiter: '/'
    };

    this._init = function () {
      // Setup event listeners
      window.addEventListener('hashchange',     this.handleHashChange.bind(this), false);

      // Reg initial hash
      pubsub.subscribe('App.loaded',            this.handleHashChange.bind(this)       );
    };

    this.model= (function () {
      var _data = {};

      var get = function (name) {
        return _data[name];
      };

      var set = function (name, value) {
        _data[name] = value;
        return this;
      };

      return {
        _data: _data, // TODO: remove for prod.
        get: get,
        set: set
      };
    }());

    this.handleHashChange = function () {
      var hashToProcess = location.hash.replace('#', '');

      if (hashToProcess === '')
        return false;

      var hashItemList = hashToProcess.split(this.setting.separator);
      hashItemList.forEach(function (hashItem) {
        var hashItemPartList = hashItem.split(this.setting.delimiter),
            hashItemKey = hashItemPartList[0],
            hashItemValue = hashItemPartList[1];

        var hashItemCurrent = this.model.get(hashItemKey);

        // Reg new Hash Item if given Hash Item is not in model
        if (typeof hashItemCurrent === 'undefined' || hashItemCurrent !== hashItemValue) {
          this.setHashProp(hashItemKey, hashItemValue, true);
        }
      }.bind(this));
    }

    this.setHashProp = function (key, value, dontGenerate) {
      this.model.set(key, value);

      if (!dontGenerate)
        this.generateNewHash();

      pubsub.publish('router.hashChange.' + key, {
        name: key,
        value: value
      });
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
});